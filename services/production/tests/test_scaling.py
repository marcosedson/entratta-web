"""Tamanho do tapete = coordenadas em mm. Escala px->mm + flip Y + coords >= 0."""
import re

from app.gcode.spiral import all_chains_for_geom
from app.gcode.writer import write_gcode
from app.geometry.regions import regions_by_aci_mm
from app.schemas import DesignPayload


def _payload(largura, altura):
    return DesignPayload(
        tamanho_mm={"largura": largura, "altura": altura},
        viewbox_px={"w": 600, "h": 400},
        borda={"estilo": "fina", "aci": 9},
        textos=[],
        logos=[],
    )


def test_bounding_box_bate_com_tamanho_mm():
    payload = _payload(600, 400)
    geom = regions_by_aci_mm(payload)[9]
    minx, miny, maxx, maxy = geom.bounds
    # borda com margem de 3% da menor dimensao: bbox = tamanho - 2*margem
    margem = min(600, 400) * 0.03
    assert abs(minx - margem) < 1.0 and abs(miny - margem) < 1.0
    assert abs(maxx - (600 - margem)) < 1.0 and abs(maxy - (400 - margem)) < 1.0


def test_coordenadas_todas_nao_negativas():
    payload = _payload(800, 500)
    regs = regions_by_aci_mm(payload)
    gcode = write_gcode(9, "t", all_chains_for_geom(regs[9]))
    for m in re.finditer(r"[XY](-?\d+\.\d+)", gcode):
        assert float(m.group(1)) >= 0.0


def test_flip_y():
    """Texto no topo do viewBox (y px pequeno) deve sair no ALTO da mesa (y mm grande)."""
    topo = DesignPayload(
        tamanho_mm={"largura": 600, "altura": 400},
        viewbox_px={"w": 600, "h": 400},
        textos=[{"texto": "A", "fonte_id": "bold", "aci": 9, "x": 300, "y": 50, "tamanho_px": 40}],
    )
    geom = regions_by_aci_mm(topo)[9]
    _, miny, _, maxy = geom.bounds
    assert miny > 300  # topo do viewBox = alto da mesa (400mm)


def test_tamanho_maior_que_mesa_rejeitado():
    import pytest
    from pydantic import ValidationError

    with pytest.raises(ValidationError):
        _payload(5000, 400)
