"""Transformacao px (viewBox do configurador) -> mm (mesa da maquina).

O G-code nao tem campo de tamanho: as coordenadas XY em mm SAO o tamanho.
Escala o espaco do viewBox inteiro para o retangulo tamanho_mm e faz flip Y
(SVG cresce para baixo; a mesa cresce para cima). Origem X0,Y0 = batente
fisico fixo da mesa — ver README do servico.
"""
from shapely.affinity import affine_transform, rotate, scale as shp_scale, translate
from shapely.geometry import MultiPolygon, Polygon

from ..schemas import DesignPayload, LogoDesign

Geom = Polygon | MultiPolygon


def px_to_mm_transform(payload: DesignPayload):
    """Funcao geom->geom aplicando escala px->mm + flip Y."""
    sx = payload.tamanho_mm.largura / payload.viewbox_px.w
    sy = payload.tamanho_mm.altura / payload.viewbox_px.h
    h_mm = payload.tamanho_mm.altura
    # x' = sx*x ; y' = h_mm - sy*y (flip Y)
    matrix = [sx, 0, 0, -sy, 0, h_mm]
    return lambda geom: affine_transform(geom, matrix)


def logo_local_to_viewbox(logo: LogoDesign, geom: Geom) -> Geom:
    """Contrato: logo.x, logo.y = CENTRO do logo no viewBox (px).

    scale e rotacao aplicados em torno do centro do bbox local do vetor.
    """
    cx = logo.largura_px / 2
    cy = logo.altura_px / 2
    g = shp_scale(geom, xfact=logo.scale, yfact=logo.scale, origin=(cx, cy))
    if logo.rotacao:
        g = rotate(g, -logo.rotacao, origin=(cx, cy))  # CSS gira horario; shapely anti-horario
    return translate(g, xoff=logo.x - cx, yoff=logo.y - cy)
