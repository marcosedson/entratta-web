"""Paleta fixa de tintas ENTRATTA (codigos ACI imutaveis — padrao da empresa)."""

# ACI -> (nome do arquivo .tap, RGB aproximado para UI/preview)
PALETTE: dict[int, tuple[str, tuple[int, int, int]]] = {
    9: ("BRANCO", (0xEB, 0xEB, 0xEB)),
    230: ("AMARELO", (0xF5, 0xC8, 0x28)),
    166: ("AZUL_ROYAL", (0x1E, 0x3C, 0x96)),
    30: ("LARANJA", (0xEB, 0x6E, 0x1E)),
    114: ("VERDE_BANDEIRA", (0x1E, 0x78, 0x37)),
}

COLOR_NAMES: dict[int, str] = {aci: name for aci, (name, _) in PALETTE.items()}
TARGET_COLORS: dict[int, tuple[int, int, int]] = {aci: rgb for aci, (_, rgb) in PALETTE.items()}

VALID_ACI = frozenset(PALETTE)


def _srgb_to_lab(rgb: tuple[int, int, int]) -> tuple[float, float, float]:
    r, g, b = (c / 255.0 for c in rgb)

    def lin(c: float) -> float:
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

    r, g, b = lin(r), lin(g), lin(b)
    x = (0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047
    y = 0.2126 * r + 0.7152 * g + 0.0722 * b
    z = (0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883

    def f(t: float) -> float:
        return t ** (1 / 3) if t > 0.008856 else 7.787 * t + 16 / 116

    fx, fy, fz = f(x), f(y), f(z)
    return 116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)


_PALETTE_LAB = {aci: _srgb_to_lab(rgb) for aci, rgb in TARGET_COLORS.items()}


def nearest_aci(rgb: tuple[int, int, int]) -> int:
    """Cor ACI mais proxima em espaco Lab (percepcao humana)."""
    lab = _srgb_to_lab(rgb)
    return min(
        _PALETTE_LAB,
        key=lambda aci: sum((a - b) ** 2 for a, b in zip(lab, _PALETTE_LAB[aci])),
    )
