"""Invariantes do formato .tap (validadas contra arquivos reais de producao)."""
import re

from app.gcode.spiral import all_chains_for_geom
from app.gcode.writer import EOL, write_gcode
from app.geometry.regions import regions_by_aci_mm


def _gcode(payload) -> str:
    regs = regions_by_aci_mm(payload)
    chains = all_chains_for_geom(regs[230])
    return write_gcode(230, payload.pedido_id, chains)


def test_cabecalho_exato(payload_simples):
    lines = _gcode(payload_simples).split(EOL)
    assert lines[0] == "N0010 (Filename: AMARELO.tap)"
    assert lines[1] == "N0020 (Post processor: Mach3 plasma.scpost)"
    assert re.fullmatch(r"N0030 \(Date: \d{2}/\d{2}/\d{4}\)", lines[2])
    assert lines[3] == "N0040 G21 (Units: Metric)"
    assert lines[4] == "N0050 G53 G90 G91.1 G40"
    assert lines[5] == "N0060 F1"
    assert lines[6] == "N0070 S500"
    assert lines[7] == "N0080 (Part: ENTR-260718-001)"
    assert (
        lines[8]
        == "N0090 (Operation: Preenchimento espiral, Colour 230, T1: AEROGRAFO, 0 mm Profundidade)"
    )
    assert lines[9] == "N0100 M06 T1 F7000.0  (AEROGRAFO)"


def test_numeracao_incrementa_de_10(payload_simples):
    numbers = [
        int(m.group(1)) for m in re.finditer(r"^N(\d+)", _gcode(payload_simples), re.M)
    ]
    assert numbers[0] == 10
    assert all(b - a == 10 for a, b in zip(numbers, numbers[1:]))


def test_z_nunca_negativo(payload_simples):
    for m in re.finditer(r"Z(-?\d+\.?\d*)", _gcode(payload_simples)):
        assert float(m.group(1)) >= 0.0


def test_m03_m05_pareados(payload_simples):
    gcode = _gcode(payload_simples)
    tokens = re.findall(r"\b(M03|M05)\b", gcode)
    # alternancia estrita M03/M05, terminando desligado (ultimo M05 do M05 M30)
    state = "off"
    for t in tokens:
        if t == "M03":
            assert state == "off"
            state = "on"
        else:
            state = "off"
    assert state == "off"
    assert gcode.rstrip(EOL).split(EOL)[-1].endswith("M05 M30")


def test_feeds_e_crlf(payload_simples):
    gcode = _gcode(payload_simples)
    assert "G01 F1000.0" in gcode
    assert "F7000.0" in gcode
    assert "\r\n" in gcode
    assert gcode.encode("ascii")  # sem acento/nao-ascii
