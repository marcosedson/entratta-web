import hashlib

from app.preview.renderer import render_preview


def _hash(img) -> str:
    return hashlib.sha256(img.tobytes()).hexdigest()


def test_preview_deterministico(payload_simples):
    h1 = _hash(render_preview(payload_simples))
    h2 = _hash(render_preview(payload_simples))
    assert h1 == h2


def test_preview_dimensoes(payload_simples):
    img = render_preview(payload_simples)
    assert img.size == (900, 600)  # viewbox * SCALE 1.5


def test_fundo_sem_textura_usa_tingimento(payload_simples):
    payload_simples.fundo.cor_id = "vermelho"
    img = render_preview(payload_simples)
    r, g, b = img.getpixel((450, 80))  # regiao de fundo (fora de texto/borda)
    assert r > g and r > b  # tingido para vermelho
