"""Escrita de .tap no formato Mach3 plasma.scpost validado contra arquivos reais.

Invariantes: Z nunca negativo (so pintura), N#### de 10 em 10, CRLF como nos
arquivos reais, comentarios em ASCII (AEROGRAFO sem acento evita problema de
encoding no Mach3).
"""
import datetime
import io
import zipfile

from ..palette import COLOR_NAMES
from .spiral import Chain

Z_SAFE = 10.0
Z_APPROACH = 0.5
Z_WORK = 0.0
F_RAPID = 7000.0
F_WORK = 1000.0

EOL = "\r\n"


def write_gcode(color_aci: int, part_name: str, chains: list[Chain]) -> str:
    lines: list[str] = []
    n = 10

    def add(txt: str) -> None:
        nonlocal n
        lines.append(f"N{n:04d} {txt}")
        n += 10

    color_name = COLOR_NAMES[color_aci]
    add(f"(Filename: {color_name}.tap)")
    add("(Post processor: Mach3 plasma.scpost)")
    add(f"(Date: {datetime.date.today().strftime('%d/%m/%Y')})")
    add("G21 (Units: Metric)")
    add("G53 G90 G91.1 G40")
    add("F1")
    add("S500")
    add(f"(Part: {part_name})")
    add(f"(Operation: Preenchimento espiral, Colour {color_aci}, T1: AEROGRAFO, 0 mm Profundidade)")
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
        for x, y in chain[1:]:
            add(f"X{x:.4f} Y{y:.4f}")
        add("M05")

    add(f"G00 Z{Z_SAFE:.4f}")
    add("M05 M30")

    return EOL.join(lines) + EOL


def build_zip(part_name: str, chains_by_aci: dict[int, list[Chain]]) -> bytes:
    """Um .tap por cor ACI usada, num zip em memoria."""
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
        for aci in sorted(chains_by_aci):
            chains = chains_by_aci[aci]
            if not chains:
                continue
            gcode = write_gcode(aci, part_name, chains)
            zf.writestr(f"{COLOR_NAMES[aci]}.tap", gcode.encode("ascii"))
    return buf.getvalue()
