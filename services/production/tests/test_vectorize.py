import io

from PIL import Image, ImageDraw

from app.vectorize import vectorize_raster


def _logo_bytes() -> bytes:
    """Logo sintetico: circulo azul com furo + retangulo laranja, fundo branco."""
    img = Image.new("RGB", (400, 300), (255, 255, 255))
    d = ImageDraw.Draw(img)
    d.ellipse((50, 50, 250, 250), fill=(30, 60, 150))
    d.ellipse((110, 110, 190, 190), fill=(255, 255, 255))  # furo
    d.rectangle((280, 100, 380, 200), fill=(235, 110, 30))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


def test_raster_detecta_regioes_e_sugere_aci():
    result = vectorize_raster(_logo_bytes())
    assert result["largura_px"] == 400
    acis = {r["aci_sugerido"] for r in result["regioes"]}
    assert 166 in acis  # azul royal
    assert 30 in acis  # laranja
    # fundo branco descartado
    assert all(r["cor_original"].upper() != "#FFFFFF" for r in result["regioes"])


def test_furo_preservado():
    result = vectorize_raster(_logo_bytes())
    azul = next(r for r in result["regioes"] if r["aci_sugerido"] == 166)
    assert any(len(p["furos"]) >= 1 for p in azul["poligonos"])


def test_poligonos_fechados_e_validos():
    result = vectorize_raster(_logo_bytes())
    for reg in result["regioes"]:
        for p in reg["poligonos"]:
            assert len(p["externo"]) >= 3
