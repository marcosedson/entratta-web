"""
Versao 2: costura os aneis de offset em uma espiral continua (uma unica
passada XY por ilha, sem fechar/reabrir loop), para eliminar a sobreposicao
nas costuras e ficar mais fiel ao padrao real do SheetCam.
"""
import ezdxf
import numpy as np
from shapely.geometry import Polygon, MultiPolygon
from collections import defaultdict
import datetime

STEP = 1.4
Z_SAFE = 10.0
Z_APPROACH = 0.5
Z_WORK = 0.0
F_RAPID = 7000.0
F_WORK = 1000.0
TOL = 0.05

COLOR_NAMES = {230: "AMARELO", 166: "AZUL_ROYAL", 30: "LARANJA", 114: "VERDE_BANDEIRA", 9: "BRANCO"}

def load_regions_by_color(dxf_path):
    doc = ezdxf.readfile(dxf_path)
    msp = doc.modelspace()
    raw = defaultdict(list)
    for e in msp:
        if e.dxftype() == 'SPLINE':
            color = e.dxf.color
            if color not in COLOR_NAMES:
                continue
            pts = [(p[0], p[1]) for p in e.flattening(TOL)]
            if len(pts) >= 3:
                raw[color].append(Polygon(pts))
    return raw

def evenodd_union(polys):
    if not polys:
        return MultiPolygon()
    result = polys[0]
    for p in polys[1:]:
        result = result.symmetric_difference(p)
    return result

def ring_points(poly):
    """retorna lista de aneis (exterior + buracos) de um shapely Polygon, sem ponto de fechamento duplicado"""
    rings = [list(poly.exterior.coords)[:-1]]
    for interior in poly.interiors:
        rings.append(list(interior.coords)[:-1])
    return rings

def nearest_pair(ring_a, ring_b):
    """indice em ring_a e ring_b mais proximos entre si (busca simples O(n*m), aceitavel p/ aneis nao gigantes)"""
    A = np.array(ring_a); B = np.array(ring_b)
    d = np.sum((A[:, None, :] - B[None, :, :]) ** 2, axis=2)
    i, j = np.unravel_index(np.argmin(d), d.shape)
    return i, j

def build_spiral_chains(component_polygon, step=STEP):
    """Gera cadeias continuas (espiral) para UM componente conectado (uma 'ilha' de pintura)."""
    levels = []
    d = 0.0
    poly = component_polygon
    while True:
        shrunk = poly.buffer(-d, join_style=1) if d > 0 else poly
        if shrunk.is_empty:
            break
        subs = list(shrunk.geoms) if hasattr(shrunk, "geoms") else [shrunk]
        subs = [s for s in subs if s.area > 1.0]
        if not subs:
            break
        level_rings = []
        for s in subs:
            level_rings.extend(ring_points(s))
        levels.append(level_rings)
        d += step
        if d > 800:
            break

    if not levels:
        return []

    chains = []
    consumed = [[False] * len(lvl) for lvl in levels]

    def trace(level_idx, ring_idx):
        chain = []
        li, ri = level_idx, ring_idx
        ring = levels[li][ri]
        consumed[li][ri] = True
        start_off = 0
        chain.extend(ring[start_off:] + ring[:start_off])
        while li + 1 < len(levels):
            next_level = levels[li + 1]
            avail = [k for k in range(len(next_level)) if not consumed[li + 1][k]]
            if not avail:
                break
            best = None
            best_d = None
            for k in avail:
                ia, ib = nearest_pair(ring, next_level[k])
                pa = np.array(ring[ia]); pb = np.array(next_level[k][ib])
                dist = np.sum((pa - pb) ** 2)
                if best_d is None or dist < best_d:
                    best_d = dist; best = (k, ia, ib)
            k, ia, ib = best
            consumed[li + 1][k] = True
            next_ring = next_level[k]
            rotated = next_ring[ib:] + next_ring[:ib]
            chain.append(tuple(ring[ia]))  # ponto de saida do anel atual
            chain.extend(rotated)          # entra no proximo anel a partir do ponto mais proximo
            ring = rotated
            li += 1
        chains.append(chain)
        # qualquer anel do proximo nivel que sobrou (bifurcacao) vira nova cadeia
        if li + 1 < len(levels):
            for k in range(len(levels[li + 1])):
                if not consumed[li + 1][k]:
                    trace(li + 1, k)

    for idx0 in range(len(levels[0])):
        if not consumed[0][idx0]:
            trace(0, idx0)

    return chains

def build_ring_chains_for_holed_shape(component_polygon, step=STEP):
    """Fallback seguro para formas COM furo: aneis fechados independentes
    (sem costura), evita saltos incorretos entre borda externa e do furo."""
    chains = []
    d = 0.0
    poly = component_polygon
    while True:
        shrunk = poly.buffer(-d, join_style=1) if d > 0 else poly
        if shrunk.is_empty:
            break
        subs = list(shrunk.geoms) if hasattr(shrunk, "geoms") else [shrunk]
        subs = [s for s in subs if s.area > 1.0]
        if not subs:
            break
        for s in subs:
            for ring in ring_points(s):
                chains.append(ring + [ring[0]])  # fecha o anel
        d += step
        if d > 800:
            break
    return chains

def all_chains_for_geom(geom, step=STEP):
    comps = list(geom.geoms) if hasattr(geom, "geoms") else [geom]
    chains = []
    for comp in comps:
        if comp.is_empty or comp.area < 1.0:
            continue
        if len(comp.interiors) > 0:
            # forma com furo: usa fallback seguro (aneis fechados)
            chains.extend(build_ring_chains_for_holed_shape(comp, step))
        else:
            # forma solida: espiral continua costurada
            chains.extend(build_spiral_chains(comp, step))
    return chains

def write_gcode(path, color_code, part_name, chains):
    lines = []
    n = 10
    def add(txt):
        nonlocal n
        lines.append(f"N{n:04d} {txt}")
        n += 10

    color_name = COLOR_NAMES[color_code]
    add(f"(Filename: {color_name}.tap)")
    add("(Post processor: Mach3 plasma.scpost)")
    add(f"(Date: {datetime.date.today().strftime('%d/%m/%Y')})")
    add("G21 (Units: Metric)")
    add("G53 G90 G91.1 G40")
    add("F1")
    add("S500")
    add(f"(Part: {part_name})")
    add(f"(Operation: Preenchimento espiral continuo, Colour {color_code}, T1: AEROGRAFO, 0 mm Profundidade)")
    add(f"M06 T1 F{F_RAPID:.1f}  (AEROGRAFO)")

    for chain in chains:
        if len(chain) < 2:
            continue
        x0, y0 = chain[0]
        add(f"G00 Z{Z_SAFE:.4f}")
        add(f"X{x0:.4f} Y{y0:.4f}")
        add(f"Z{Z_APPROACH:.4f}")
        add(f"Z{Z_WORK:.4f}")
        add("M03")
        add(f"G01 F{F_WORK:.1f}")
        for (x, y) in chain[1:]:
            add(f"X{x:.4f} Y{y:.4f}")
        add("M05")

    add(f"G00 Z{Z_SAFE:.4f}")
    add("M05 M30")

    with open(path, "w") as f:
        f.write("\n".join(lines) + "\n")

if __name__ == "__main__":
    regions = load_regions_by_color('/mnt/user-data/uploads/A_ECONOMICA.dxf')
    for color_code, polys in sorted(regions.items()):
        geom = evenodd_union(polys)
        chains = all_chains_for_geom(geom, STEP)
        total_pts = sum(len(c) for c in chains)
        print(f"Color {color_code} ({COLOR_NAMES[color_code]}): {len(polys)} splines -> {len(chains)} ilhas (cadeias continuas), {total_pts} pontos")
        out_path = f"/home/claude/ESPIRAL_{COLOR_NAMES[color_code]}.tap"
        write_gcode(out_path, color_code, "A ECONOMICA (espiral continua)", chains)
