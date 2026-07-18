"""
Renderiza uma previa realista do capacho pintado, usando texturas reais
(recortadas de fotos de produto) tingidas com a cor de cada regiao do
desenho vetorial (DXF), preservando o detalhe do fio/loop do vinil.
"""
from PIL import Image, ImageDraw
import numpy as np
from gen_gcode_spiral import load_regions_by_color, evenodd_union, COLOR_NAMES

SCALE = 0.6  # pixels por mm no render

# paleta alvo (RGB aproximado de cada cor fisica da ENTRATTA/TAPMAQ)
TARGET_COLORS = {
    9:   (235, 235, 235),   # branco
    230: (245, 200, 40),    # amarelo
    166: (30, 60, 150),     # azul royal
    30:  (235, 110, 30),    # laranja
    114: (30, 120, 55),     # verde bandeira
}

def tile_texture(patch_path, size):
    patch = Image.open(patch_path).convert("RGB")
    w, h = size
    pw, ph = patch.size
    out = Image.new("RGB", size)
    for x in range(0, w, pw):
        for y in range(0, h, ph):
            out.paste(patch, (x, y))
    return out

def colorize_by_luminance(tex_img, target_rgb):
    arr = np.asarray(tex_img).astype(np.float32)
    lum = arr.mean(axis=2, keepdims=True) / 128.0  # ~1.0 = medio
    tinted = lum * np.array(target_rgb, dtype=np.float32)
    return np.clip(tinted, 0, 255).astype(np.uint8)

def polygon_mask(geom, size, offset, scale):
    mask = Image.new("L", size, 0)
    draw = ImageDraw.Draw(mask)
    comps = list(geom.geoms) if hasattr(geom, "geoms") else [geom]
    for comp in comps:
        ext = [((x - offset[0]) * scale, (y - offset[1]) * scale) for x, y in comp.exterior.coords]
        draw.polygon(ext, fill=255)
        for interior in comp.interiors:
            hole = [((x - offset[0]) * scale, (y - offset[1]) * scale) for x, y in interior.coords]
            draw.polygon(hole, fill=0)
    return mask

if __name__ == "__main__":
    regions = load_regions_by_color('/mnt/user-data/uploads/A_ECONOMICA.dxf')

    all_x, all_y = [], []
    for polys in regions.values():
        for p in polys:
            xs, ys = p.exterior.xy
            all_x += list(xs); all_y += list(ys)
    minx, maxx = min(all_x), max(all_x)
    miny, maxy = min(all_y), max(all_y)
    pad = 40
    w = int((maxx - minx + 2*pad) * SCALE)
    h = int((maxy - miny + 2*pad) * SCALE)
    offset = (minx - pad, miny - pad)

    base = tile_texture('/home/claude/tex_grey.png', (w, h))
    canvas = colorize_by_luminance(base, TARGET_COLORS[9])  # fundo cinza real (sem tingir, cor propria)
    canvas = np.asarray(base).copy()  # fundo = textura cinza original, sem tingimento

    for color_code, polys in regions.items():
        geom = evenodd_union(polys)
        mask = polygon_mask(geom, (w, h), offset, SCALE)
        mask_arr = np.asarray(mask) > 0

        tex_tile = tile_texture('/home/claude/tex_grey.png', (w, h))
        tinted = colorize_by_luminance(tex_tile, TARGET_COLORS[color_code])
        canvas[mask_arr] = tinted[mask_arr]

    out = Image.fromarray(canvas, "RGB")
    out = out.transpose(Image.FLIP_TOP_BOTTOM)  # DXF Y cresce pra cima, imagem Y cresce pra baixo
    out.save('/home/claude/preview_realista.png')
    print("salvo", out.size)
