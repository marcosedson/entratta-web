"""Vetorizacao de logo raster (PNG/JPG) ou SVG -> regioes de poligonos por cor ACI.

Raster: quantiza a ate 5 cores (uma por tinta fisica possivel) -> vtracer por
camada de cor -> poligonos -> ACI mais proximo em Lab sugerido por regiao.
SVG: parse direto, agrupa por fill, remapeia cada fill para ACI mais proximo.
O cliente ajusta o ACI de cada regiao na UI; o vetor resultante e definitivo
(preview e G-code usam exatamente estes poligonos).
"""
import io
import tempfile
from collections import defaultdict
from pathlib import Path

import numpy as np
import vtracer
from PIL import Image
from shapely.geometry import Polygon
from shapely.ops import unary_union
from svgelements import SVG, Path as SvgPath, Shape

from .gcode.spiral import evenodd_union
from .palette import nearest_aci, TARGET_COLORS

MAX_COLORS = 8
MAX_DIM = 800  # px — normaliza logos gigantes antes de vetorizar
FLATTEN_TOL = 0.5  # px
MIN_REGION_AREA_PX = 4.0
ALPHA_THRESHOLD = 60


def _paths_from_svg_text(svg_text: str) -> list[tuple[tuple[int, int, int], Polygon]]:
    """(cor RGB do fill, poligono) para cada subpath fechado do SVG."""
    out: list[tuple[tuple[int, int, int], Polygon]] = []
    svg = SVG.parse(io.StringIO(svg_text))
    for element in svg.elements():
        if not isinstance(element, Shape):
            continue
        fill = getattr(element, "fill", None)
        if fill is None or fill.value is None:
            continue
        rgb = (fill.red, fill.green, fill.blue)
        try:
            path = SvgPath(element) if not isinstance(element, SvgPath) else element
        except (TypeError, ValueError):
            continue
        for subpath in path.as_subpaths():
            pts = [
                (seg.end.x, seg.end.y)
                for seg in SvgPath(subpath).segments()
                if seg.end is not None
            ]
            if len(pts) >= 3:
                poly = Polygon(pts)
                if not poly.is_valid:
                    poly = poly.buffer(0)
                if not poly.is_empty and poly.area >= MIN_REGION_AREA_PX:
                    out.append((rgb, poly))
    return out


def _regions_from_colored_polys(
    colored: list[tuple[tuple[int, int, int], Polygon]],
) -> list[dict]:
    by_color: dict[tuple[int, int, int], list[Polygon]] = defaultdict(list)
    for rgb, poly in colored:
        by_color[rgb].append(poly)

    regioes = []
    for rgb, polys in by_color.items():
        geom = evenodd_union(polys)
        if geom.is_empty:
            continue
        comps = list(geom.geoms) if hasattr(geom, "geoms") else [geom]
        poligonos = []
        for comp in comps:
            if comp.is_empty or comp.area < MIN_REGION_AREA_PX:
                continue
            poligonos.append(
                {
                    "externo": [[round(x, 2), round(y, 2)] for x, y in comp.exterior.coords],
                    "furos": [
                        [[round(x, 2), round(y, 2)] for x, y in i.coords]
                        for i in comp.interiors
                    ],
                }
            )
        if poligonos:
            suggested = nearest_aci(rgb)
            regioes.append(
                {
                    "cor_original": "#{:02X}{:02X}{:02X}".format(*rgb),
                    "cor_original_rgb": [int(rgb[0]), int(rgb[1]), int(rgb[2])],
                    "aci_sugerido": suggested,
                    "aci_sugerido_rgb": [int(v) for v in TARGET_COLORS[suggested]],
                    "poligonos": poligonos,
                }
            )
    return regioes


def vectorize_raster(image_bytes: bytes) -> dict:
    img = Image.open(io.BytesIO(image_bytes)).convert("RGBA")
    if max(img.size) > MAX_DIM:
        ratio = MAX_DIM / max(img.size)
        img = img.resize((int(img.width * ratio), int(img.height * ratio)), Image.LANCZOS)

    # fundo transparente -> branco (vtracer nao entende alpha como "vazio" de forma confiavel)
    alpha = np.asarray(img)[:, :, 3]
    background = Image.new("RGBA", img.size, (255, 255, 255, 255))
    background.paste(img, mask=img.split()[3])
    rgb = background.convert("RGB")

    # quantiza a MAX_COLORS+1 (uma sobra para o fundo branco descartavel);
    # sem dither — pixels misturados fragmentariam a vetorizacao
    quant = rgb.quantize(
        colors=MAX_COLORS + 1, method=Image.MEDIANCUT, dither=Image.Dither.NONE
    ).convert("RGB")
    w, h = quant.size
    arr = np.asarray(quant)
    unique_colors = np.unique(arr.reshape(-1, 3), axis=0)

    # vetoriza CADA cor separadamente em modo binario (vtracer em modo color
    # recria dezenas de cores intermediarias nas bordas — inutilizavel aqui)
    colored: list[tuple[tuple[int, int, int], Polygon]] = []
    with tempfile.TemporaryDirectory() as tmp:
        for color in unique_colors:
            rgb_color = tuple(int(c) for c in color)
            if all(c > 235 for c in rgb_color):
                continue  # fundo branco nao e pintado
            layer_mask = np.all(arr == color, axis=2)
            if layer_mask.sum() < MIN_REGION_AREA_PX:
                continue
            # camada preta sobre branco (vtracer binario traça o escuro)
            layer = np.full((h, w), 255, dtype=np.uint8)
            layer[layer_mask] = 0
            in_path = Path(tmp) / "layer.png"
            out_path = Path(tmp) / "layer.svg"
            Image.fromarray(layer, "L").convert("RGB").save(in_path)
            vtracer.convert_image_to_svg_py(
                str(in_path),
                str(out_path),
                colormode="binary",
                mode="polygon",
                filter_speckle=8,
            )
            for _, poly in _paths_from_svg_text(out_path.read_text()):
                colored.append((rgb_color, poly))

    return {
        "largura_px": w,
        "altura_px": h,
        "regioes": _regions_from_colored_polys(colored),
    }


def vectorize_svg(svg_bytes: bytes) -> dict:
    svg_text = svg_bytes.decode("utf-8", errors="replace")
    colored = _paths_from_svg_text(svg_text)
    if not colored:
        return {"largura_px": 0, "altura_px": 0, "regioes": []}
    bounds = unary_union([p for _, p in colored]).bounds
    return {
        "largura_px": round(bounds[2], 2),
        "altura_px": round(bounds[3], 2),
        "regioes": _regions_from_colored_polys(colored),
    }
