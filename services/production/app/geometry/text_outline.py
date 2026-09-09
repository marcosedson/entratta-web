"""Texto -> poligonos shapely via fontTools.

Contrato de posicionamento: (x, y) = CENTRO do bloco de texto no viewBox (px),
tamanho_px = corpo da fonte (em px do viewBox). Furos (contra-formas, ex. "O")
resolvidos por even-odd dentro de cada glifo; glifos unidos por unary_union
(fontes cursivas com letras sobrepostas nao geram furos espurios).
"""
from fontTools.pens.basePen import BasePen
from fontTools.ttLib import TTFont
from shapely.affinity import translate
from shapely.geometry import MultiPolygon, Polygon
from shapely.ops import unary_union

from ..fonts import load_font
from ..gcode.spiral import evenodd_union

CURVE_STEPS = 12  # subdivisao de beziers (~TOL 0.05 nos corpos usados em capacho)


class _FlattenPen(BasePen):
    """Achata contornos de glifo em listas de pontos."""

    def __init__(self, glyph_set):
        super().__init__(glyph_set)
        self.contours: list[list[tuple[float, float]]] = []
        self._current: list[tuple[float, float]] = []

    def _moveTo(self, pt):
        self._current = [pt]

    def _lineTo(self, pt):
        self._current.append(pt)

    def _curveToOne(self, p1, p2, p3):
        p0 = self._current[-1]
        for i in range(1, CURVE_STEPS + 1):
            t = i / CURVE_STEPS
            mt = 1 - t
            x = mt**3 * p0[0] + 3 * mt**2 * t * p1[0] + 3 * mt * t**2 * p2[0] + t**3 * p3[0]
            y = mt**3 * p0[1] + 3 * mt**2 * t * p1[1] + 3 * mt * t**2 * p2[1] + t**3 * p3[1]
            self._current.append((x, y))

    def _qCurveToOne(self, p1, p2):
        p0 = self._current[-1]
        for i in range(1, CURVE_STEPS + 1):
            t = i / CURVE_STEPS
            mt = 1 - t
            x = mt**2 * p0[0] + 2 * mt * t * p1[0] + t**2 * p2[0]
            y = mt**2 * p0[1] + 2 * mt * t * p1[1] + t**2 * p2[1]
            self._current.append((x, y))

    def _closePath(self):
        if len(self._current) >= 3:
            self.contours.append(self._current)
        self._current = []


def _glyph_geom(font: TTFont, glyph_set, glyph_name: str) -> Polygon | MultiPolygon:
    pen = _FlattenPen(glyph_set)
    glyph_set[glyph_name].draw(pen)
    polys = [Polygon(c) for c in pen.contours]
    polys = [p if p.is_valid else p.buffer(0) for p in polys if p.area > 0 or True]
    polys = [p for p in polys if not p.is_empty]
    if not polys:
        return MultiPolygon()
    return evenodd_union(polys)


def _kerning(font: TTFont, left: str, right: str) -> float:
    kern = font.get("kern")
    if kern is None:
        return 0.0
    for table in kern.kernTables:
        value = getattr(table, "kernTable", {}).get((left, right))
        if value:
            return float(value)
    return 0.0


def text_to_polygons(
    texto: str, fonte_id: str, tamanho_px: float, x: float, y: float
) -> Polygon | MultiPolygon:
    font = load_font(fonte_id)
    glyph_set = font.getGlyphSet()
    cmap = font.getBestCmap()
    upem = font["head"].unitsPerEm
    scale = tamanho_px / upem

    pieces = []
    pen_x = 0.0
    prev_glyph: str | None = None
    for ch in texto:
        glyph_name = cmap.get(ord(ch))
        if glyph_name is None:
            prev_glyph = None
            pen_x += 0.5 * upem  # espaco para caractere sem glifo
            continue
        if prev_glyph is not None:
            pen_x += _kerning(font, prev_glyph, glyph_name)
        geom = _glyph_geom(font, glyph_set, glyph_name)
        if not geom.is_empty:
            pieces.append(translate(geom, xoff=pen_x))
        pen_x += glyph_set[glyph_name].width
        prev_glyph = glyph_name

    if not pieces:
        return MultiPolygon()

    merged = unary_union(pieces)
    # espaco de fonte: y cresce para CIMA. Espelha para o espaco SVG (y para baixo)
    # e centra o bbox em (x, y).
    minx, miny, maxx, maxy = merged.bounds
    cx, cy = (minx + maxx) / 2, (miny + maxy) / 2

    def to_viewbox(px_, py_):
        return (x + (px_ - cx) * scale, y - (py_ - cy) * scale)

    def map_poly(p: Polygon) -> Polygon:
        shell = [to_viewbox(px_, py_) for px_, py_ in p.exterior.coords]
        holes = [[to_viewbox(px_, py_) for px_, py_ in i.coords] for i in p.interiors]
        return Polygon(shell, holes)

    comps = merged.geoms if hasattr(merged, "geoms") else [merged]
    mapped = [map_poly(p) for p in comps]
    mapped = [p if p.is_valid else p.buffer(0) for p in mapped]
    return unary_union(mapped)
