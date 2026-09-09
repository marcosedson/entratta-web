"""Monta as regioes pintaveis (shapely, em px do viewBox) a partir do payload,
agrupadas por cor ACI. Unica fonte de geometria para preview E G-code."""
from collections import defaultdict

from shapely.geometry import MultiPolygon, Polygon
from shapely.ops import unary_union

from ..schemas import DesignPayload
from .text_outline import text_to_polygons
from .transforms import Geom, logo_local_to_viewbox, px_to_mm_transform

# Espessuras de borda proporcionais ao viewBox (mesma proporcao do SVG do configurador)
BORDER_THICKNESS_FRAC = 0.018  # da menor dimensao
BORDER_MARGIN_FRAC = 0.03
BORDER_GAP_FRAC = 0.012  # vao entre as duas linhas da borda dupla


def _border_geoms(payload: DesignPayload) -> list[Polygon]:
    if payload.borda.estilo == "sem":
        return []
    w, h = payload.viewbox_px.w, payload.viewbox_px.h
    m = min(w, h)
    t = m * BORDER_THICKNESS_FRAC
    margin = m * BORDER_MARGIN_FRAC

    def frame(offset: float) -> Polygon:
        outer = Polygon(
            [(offset, offset), (w - offset, offset), (w - offset, h - offset), (offset, h - offset)]
        )
        inner = outer.buffer(-t, join_style=2)
        return Polygon(outer.exterior.coords, [inner.exterior.coords])

    frames = [frame(margin)]
    if payload.borda.estilo == "dupla":
        frames.append(frame(margin + t + m * BORDER_GAP_FRAC))
    return frames


def regions_by_aci_px(payload: DesignPayload) -> dict[int, Geom]:
    """Geometrias por ACI no espaco px do viewBox (y para baixo)."""
    parts: dict[int, list[Geom]] = defaultdict(list)

    for f in _border_geoms(payload):
        parts[payload.borda.aci].append(f)

    for t in payload.textos:
        geom = text_to_polygons(t.texto, t.fonte_id, t.tamanho_px, t.x, t.y)
        if not geom.is_empty:
            parts[t.aci].append(geom)

    for logo in payload.logos:
        for regiao in logo.regioes:
            polys = [
                Polygon(p.externo, p.furos) for p in regiao.poligonos if len(p.externo) >= 3
            ]
            if not polys:
                continue
            geom = unary_union([p if p.is_valid else p.buffer(0) for p in polys])
            geom = logo_local_to_viewbox(logo, geom)
            if not geom.is_empty:
                parts[regiao.aci].append(geom)

    return {aci: unary_union(geoms) for aci, geoms in parts.items() if geoms}


def regions_by_aci_mm(payload: DesignPayload) -> dict[int, Geom]:
    """Geometrias por ACI em mm da mesa (y para cima, origem no batente)."""
    to_mm = px_to_mm_transform(payload)
    return {aci: to_mm(g) for aci, g in regions_by_aci_px(payload).items()}
