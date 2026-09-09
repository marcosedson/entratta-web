"""Preenchimento por espiral costurada (porte validado de gen_gcode_spiral.py).

Formas sem furo: espiral continua — offset inward por contorno paralelo, costurando
cada anel ao proximo pelo par de pontos mais proximo, sem levantar o aerografo.
Formas COM furo: aneis fechados independentes (modo seguro — espiral costurada em
forma anular cria saltos atravessando o desenho; problema de CAM nao resolvido).
"""
import numpy as np
from shapely.geometry import MultiPolygon, Polygon

STEP = 1.4  # mm entre passadas (pitch medido nos .tap reais)
MIN_AREA = 1.0  # mm² — fatias de offset menores que isso sao ruido
MAX_OFFSET = 800.0  # mm — trava de seguranca do loop de offset

Point = tuple[float, float]
Chain = list[Point]


def evenodd_union(polys: list[Polygon]) -> Polygon | MultiPolygon:
    if not polys:
        return MultiPolygon()
    result = polys[0]
    for p in polys[1:]:
        result = result.symmetric_difference(p)
    return result


def ring_points(poly: Polygon) -> list[Chain]:
    """Aneis (exterior + furos) de um Polygon, sem ponto de fechamento duplicado."""
    rings = [list(poly.exterior.coords)[:-1]]
    for interior in poly.interiors:
        rings.append(list(interior.coords)[:-1])
    return rings


def nearest_pair(ring_a: Chain, ring_b: Chain) -> tuple[int, int]:
    a = np.array(ring_a)
    b = np.array(ring_b)
    d = np.sum((a[:, None, :] - b[None, :, :]) ** 2, axis=2)
    i, j = np.unravel_index(np.argmin(d), d.shape)
    return int(i), int(j)


def _offset_levels(poly: Polygon, step: float) -> list[list[Chain]]:
    levels = []
    d = 0.0
    while True:
        shrunk = poly.buffer(-d, join_style=1) if d > 0 else poly
        if shrunk.is_empty:
            break
        subs = list(shrunk.geoms) if hasattr(shrunk, "geoms") else [shrunk]
        subs = [s for s in subs if s.area > MIN_AREA]
        if not subs:
            break
        level_rings = []
        for s in subs:
            level_rings.extend(ring_points(s))
        levels.append(level_rings)
        d += step
        if d > MAX_OFFSET:
            break
    return levels


def build_spiral_chains(component: Polygon, step: float = STEP) -> list[Chain]:
    """Cadeias continuas (espiral) para UM componente conectado sem furo."""
    levels = _offset_levels(component, step)
    if not levels:
        return []

    chains: list[Chain] = []
    consumed = [[False] * len(lvl) for lvl in levels]

    def trace(level_idx: int, ring_idx: int) -> None:
        chain: Chain = []
        li, ri = level_idx, ring_idx
        ring = levels[li][ri]
        consumed[li][ri] = True
        chain.extend(ring)
        while li + 1 < len(levels):
            next_level = levels[li + 1]
            avail = [k for k in range(len(next_level)) if not consumed[li + 1][k]]
            if not avail:
                break
            best = None
            best_d = None
            for k in avail:
                ia, ib = nearest_pair(ring, next_level[k])
                pa = np.array(ring[ia])
                pb = np.array(next_level[k][ib])
                dist = float(np.sum((pa - pb) ** 2))
                if best_d is None or dist < best_d:
                    best_d = dist
                    best = (k, ia, ib)
            k, ia, ib = best
            consumed[li + 1][k] = True
            next_ring = next_level[k]
            rotated = next_ring[ib:] + next_ring[:ib]
            chain.append(tuple(ring[ia]))  # ponto de saida do anel atual
            chain.extend(rotated)  # entra no proximo anel pelo ponto mais proximo
            ring = rotated
            li += 1
        chains.append(chain)
        # aneis restantes do proximo nivel (bifurcacao) viram novas cadeias
        if li + 1 < len(levels):
            for k in range(len(levels[li + 1])):
                if not consumed[li + 1][k]:
                    trace(li + 1, k)

    for idx0 in range(len(levels[0])):
        if not consumed[0][idx0]:
            trace(0, idx0)

    return chains


def build_ring_chains_for_holed_shape(component: Polygon, step: float = STEP) -> list[Chain]:
    """Aneis fechados independentes para formas com furo (cada anel e uma passada propria)."""
    chains: list[Chain] = []
    for level in _offset_levels(component, step):
        for ring in level:
            chains.append(ring + [ring[0]])  # fecha o anel
    return chains


def all_chains_for_geom(geom: Polygon | MultiPolygon, step: float = STEP) -> list[Chain]:
    comps = list(geom.geoms) if hasattr(geom, "geoms") else [geom]
    chains: list[Chain] = []
    for comp in comps:
        if comp.is_empty or comp.area < MIN_AREA:
            continue
        if len(comp.interiors) > 0:
            chains.extend(build_ring_chains_for_holed_shape(comp, step))
        else:
            chains.extend(build_spiral_chains(comp, step))
    return chains
