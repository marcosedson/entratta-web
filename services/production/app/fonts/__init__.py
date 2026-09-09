"""Mapa fonteId (mesmo id de FONTES em app/monte-o-seu/types.ts) -> arquivo .ttf + peso.

Georgia (proprietaria) substituida por Gelasio (metric-compatible, OFL).
Fontes variaveis sao instanciadas no peso alvo via fontTools.instancer.
"""
from functools import lru_cache
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

FONTS_DIR = Path(__file__).parent

# fonte_id -> (arquivo, peso)
FONT_MAP: dict[str, tuple[str, int]] = {
    "bold": ("Inter.ttf", 800),
    "moderna": ("Montserrat.ttf", 700),
    "romana": ("Cinzel.ttf", 700),
    "bebas": ("BebasNeue.ttf", 400),
    "condensed": ("Oswald.ttf", 600),
    "casual": ("Pacifico.ttf", 400),
    "cursive": ("DancingScript.ttf", 700),
    "editorial": ("PlayfairDisplay.ttf", 900),
    "serif": ("Gelasio.ttf", 700),
    "rounded": ("Nunito.ttf", 800),
}

DEFAULT_FONT_ID = "bold"


@lru_cache(maxsize=16)
def load_font(fonte_id: str) -> TTFont:
    filename, weight = FONT_MAP.get(fonte_id, FONT_MAP[DEFAULT_FONT_ID])
    font = TTFont(FONTS_DIR / filename)
    if "fvar" in font:
        axes = {a.axisTag: a for a in font["fvar"].axes}
        pin = {}
        if "wght" in axes:
            a = axes["wght"]
            pin["wght"] = min(max(weight, a.minValue), a.maxValue)
        if "opsz" in axes:
            pin["opsz"] = axes["opsz"].defaultValue
        if pin:
            font = instancer.instantiateVariableFont(font, pin)
    return font
