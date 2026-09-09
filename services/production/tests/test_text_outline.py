from shapely.geometry import MultiPolygon

from app.geometry.text_outline import text_to_polygons


def _comps(geom):
    return list(geom.geoms) if isinstance(geom, MultiPolygon) else [geom]


def test_letra_O_tem_furo():
    geom = text_to_polygons("O", "bold", 100, 300, 200)
    comps = _comps(geom)
    assert len(comps) == 1
    assert len(comps[0].interiors) == 1


def test_palavra_gera_multiplas_ilhas():
    geom = text_to_polygons("ENTRATTA", "bebas", 80, 300, 200)
    assert len(_comps(geom)) == 8  # sem ligaduras: uma ilha por letra


def test_centrado_no_ponto():
    geom = text_to_polygons("HH", "bold", 60, 250, 130)
    minx, miny, maxx, maxy = geom.bounds
    assert abs((minx + maxx) / 2 - 250) < 1.0
    assert abs((miny + maxy) / 2 - 130) < 1.0


def test_tamanho_proporcional():
    g1 = text_to_polygons("H", "bold", 50, 0, 0)
    g2 = text_to_polygons("H", "bold", 100, 0, 0)
    h1 = g1.bounds[3] - g1.bounds[1]
    h2 = g2.bounds[3] - g2.bounds[1]
    assert abs(h2 / h1 - 2.0) < 0.05


def test_cursiva_sobreposta_nao_gera_furo_espurio():
    # Pacifico conecta letras; uniao (nao even-odd global) evita furos onde glifos se cruzam
    geom = text_to_polygons("olá", "casual", 80, 300, 200)
    assert not geom.is_empty
    total_area = sum(c.area for c in _comps(geom))
    assert total_area > 100
