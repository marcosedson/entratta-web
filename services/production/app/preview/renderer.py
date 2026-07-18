"""Preview fotorrealista deterministico (sem IA generativa).

Textura real de capacho (patch de foto de produto) ladrilhada + mascara por cor
(even-odd para furos) + tingimento por luminancia:
    pixel = (luminancia_da_textura / 128) * cor_alvo_RGB
preservando o relevo do fio, so variando a cor.
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

from ..geometry.regions import regions_by_aci_px
from ..palette import TARGET_COLORS
from ..schemas import DesignPayload

TEXTURES_DIR = Path(__file__).parent / "textures"
SCALE = 1.5  # pixels do render por px de viewBox (nitidez do preview)

# cor de manta (id do configurador) -> (arquivo de textura propria ou None, hex de tingimento)
BACKGROUND_TEXTURES: dict[str, tuple[str | None, tuple[int, int, int] | None]] = {
    "cinza": ("tex_cinza.png", None),
    "verde": ("tex_verde.png", None),
    "preto": (None, (0x2A, 0x2A, 0x2A)),
    "azul": (None, (0x0F, 0x2D, 0x52)),
    "vermelho": (None, (0x99, 0x1B, 0x1B)),
    "marrom": (None, (0x78, 0x35, 0x0F)),
    "bege": (None, (0xD4, 0xB8, 0x96)),
}


def _tile_texture(patch_path: Path, size: tuple[int, int]) -> Image.Image:
    patch = Image.open(patch_path).convert("RGB")
    w, h = size
    pw, ph = patch.size
    out = Image.new("RGB", size)
    for x in range(0, w, pw):
        for y in range(0, h, ph):
            out.paste(patch, (x, y))
    return out


def _colorize_by_luminance(tex: Image.Image, target_rgb: tuple[int, int, int]) -> np.ndarray:
    arr = np.asarray(tex).astype(np.float32)
    lum = arr.mean(axis=2, keepdims=True) / 128.0
    tinted = lum * np.array(target_rgb, dtype=np.float32)
    return np.clip(tinted, 0, 255).astype(np.uint8)


def _geom_mask(geom, size: tuple[int, int], scale: float) -> np.ndarray:
    mask = Image.new("L", size, 0)
    draw = ImageDraw.Draw(mask)
    comps = list(geom.geoms) if hasattr(geom, "geoms") else [geom]
    for comp in comps:
        if comp.is_empty:
            continue
        ext = [(x * scale, y * scale) for x, y in comp.exterior.coords]
        draw.polygon(ext, fill=255)
        for interior in comp.interiors:
            hole = [(x * scale, y * scale) for x, y in interior.coords]
            draw.polygon(hole, fill=0)
    return np.asarray(mask) > 0


def render_preview(payload: DesignPayload) -> Image.Image:
    """Renderiza a prévia garantindo tonalidade do fundo consistente.

    Estratégia:
    - Sempre gerar a textura base a partir do patch (ou fallback tex_cinza).
    - Colorizar o fundo usando a mesma função de tingimento por luminância usada nas regiões
      (mesma transformação), passando como target a tint definida ou a cor cinza padrão.
    - Usar a textura cinza original como fonte para pintar as regiões (tinting), evitando
      variações entre texturas de origem.
    """
    w = int(payload.viewbox_px.w * SCALE)
    h = int(payload.viewbox_px.h * SCALE)

    tex_file, tint = BACKGROUND_TEXTURES.get(payload.fundo.cor_id, (None, None))
    # Fonte da textura de base (se existir) — caso contrario usar a textura cinza padrão
    base_source = TEXTURES_DIR / (tex_file if tex_file else "tex_cinza.png")
    base_tex = _tile_texture(base_source, (w, h))

    # Escolher cor alvo para o fundo: se tint fornecida, usar; caso contrario usar o cinza padrao
    bg_rgb = tint if tint is not None else TARGET_COLORS.get(9, (235, 235, 235))
    canvas = _colorize_by_luminance(base_tex, bg_rgb)

    # Fonte unificada para pintar regioes: sempre usar a textura cinza original antes de tingir
    paint_tex = _tile_texture(TEXTURES_DIR / "tex_cinza.png", (w, h))

    for aci, geom in regions_by_aci_px(payload).items():
        mask = _geom_mask(geom, (w, h), SCALE)
        tinted = _colorize_by_luminance(paint_tex, TARGET_COLORS[aci])
        canvas[mask] = tinted[mask]

    return Image.fromarray(canvas, "RGB")
