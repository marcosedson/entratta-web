"""Paridade contra arquivos reais de producao (A ECONOMICA).

Gera G-code a partir do DXF fonte e compara o comprimento total de traco
pintado (entre M03 e M05) contra o .tap real gerado pelo SheetCam.
O prototipo validou ~94% de equivalencia; aceitamos razao em [0.75, 1.25]
(reais usam arcos G02/G03, nos polilinha achatada; densidade e o que importa).
"""
import math
import re
from collections import defaultdict
from pathlib import Path

import ezdxf
import pytest
from shapely.geometry import Polygon

from app.gcode.spiral import all_chains_for_geom, evenodd_union
from app.palette import COLOR_NAMES

FIXTURES = Path(__file__).parent / "fixtures"
DXF = FIXTURES / "A_ECONOMICA.dxf"
TOL = 0.05


def _load_regions_by_color(dxf_path):
    doc = ezdxf.readfile(dxf_path)
    msp = doc.modelspace()
    raw = defaultdict(list)
    for e in msp:
        if e.dxftype() == "SPLINE":
            color = e.dxf.color
            if color not in COLOR_NAMES:
                continue
            pts = [(p[0], p[1]) for p in e.flattening(TOL)]
            if len(pts) >= 3:
                raw[color].append(Polygon(pts))
    return raw


def _chain_length(chain) -> float:
    return sum(math.dist(chain[i], chain[i + 1]) for i in range(len(chain) - 1))


def _real_tap_paint_length(path: Path) -> float:
    """Comprimento pintado (M03..M05) somando retas e arcos G02/G03."""
    total = 0.0
    x = y = None
    painting = False
    mode = "G01"
    for line in path.read_text(encoding="latin-1").splitlines():
        line = re.sub(r"^N\d+\s*", "", line).strip()
        if "M03" in line:
            painting = True
            continue
        if "M05" in line:
            painting = False
            continue
        g = re.match(r"(G0[0-3])", line)
        if g:
            mode = g.group(1)
        mx = re.search(r"X(-?\d+\.?\d*)", line)
        my = re.search(r"Y(-?\d+\.?\d*)", line)
        if not mx and not my:
            continue
        nx = float(mx.group(1)) if mx else x
        ny = float(my.group(1)) if my else y
        if x is not None and painting and mode in ("G01", "G02", "G03"):
            if mode in ("G02", "G03"):
                mi = re.search(r"I(-?\d+\.?\d*)", line)
                mj = re.search(r"J(-?\d+\.?\d*)", line)
                if mi and mj:
                    cx, cy = x + float(mi.group(1)), y + float(mj.group(1))
                    r = math.dist((x, y), (cx, cy))
                    a0 = math.atan2(y - cy, x - cx)
                    a1 = math.atan2(ny - cy, nx - cx)
                    da = a1 - a0
                    if mode == "G02":  # horario
                        da = da - 2 * math.pi if da > 0 else da
                    else:
                        da = da + 2 * math.pi if da < 0 else da
                    total += abs(da) * r
                else:
                    total += math.dist((x, y), (nx, ny))
            else:
                total += math.dist((x, y), (nx, ny))
        x, y = nx, ny
    return total


@pytest.fixture(scope="module")
def dxf_regions():
    if not DXF.exists():
        pytest.skip("DXF real nao disponivel")
    return _load_regions_by_color(DXF)


@pytest.mark.parametrize("aci", [9, 230, 166, 30, 114])
def test_comprimento_de_traco_por_cor(dxf_regions, aci):
    real_path = FIXTURES / f"real_{COLOR_NAMES[aci]}.tap"
    if aci not in dxf_regions or not real_path.exists():
        pytest.skip(f"cor {aci} ausente nas fixtures")
    geom = evenodd_union(dxf_regions[aci])
    chains = all_chains_for_geom(geom)
    ours = sum(_chain_length(c) for c in chains)
    real = _real_tap_paint_length(real_path)
    assert real > 0
    ratio = ours / real
    assert 0.75 <= ratio <= 1.25, f"razao {ratio:.3f} (nosso {ours:.0f}mm vs real {real:.0f}mm)"
