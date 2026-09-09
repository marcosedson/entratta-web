from shapely.geometry import Point, Polygon

from app.gcode.spiral import (
    STEP,
    all_chains_for_geom,
    build_ring_chains_for_holed_shape,
    build_spiral_chains,
)


def test_forma_solida_gera_espiral_continua():
    square = Polygon([(0, 0), (100, 0), (100, 100), (0, 100)])
    chains = build_spiral_chains(square)
    # espiral costurada: uma unica cadeia continua cobrindo todos os niveis
    assert len(chains) == 1
    # profundidade esperada de niveis: ~50/STEP aneis encadeados
    assert len(chains[0]) > 100


def test_forma_com_furo_gera_apenas_aneis_fechados():
    ring = Point(50, 50).buffer(40).difference(Point(50, 50).buffer(15))
    chains = build_ring_chains_for_holed_shape(ring)
    assert len(chains) > 2
    for c in chains:
        assert c[0] == c[-1]  # todo anel fechado


def test_dispatch_por_topologia():
    solid = Polygon([(0, 0), (60, 0), (60, 60), (0, 60)])
    holed = Point(200, 50).buffer(40).difference(Point(200, 50).buffer(15))
    chains_solid = all_chains_for_geom(solid)
    chains_holed = all_chains_for_geom(holed)
    assert len(chains_solid) == 1  # espiral
    assert all(c[0] == c[-1] for c in chains_holed)  # aneis


def test_area_minuscula_ignorada():
    tiny = Polygon([(0, 0), (0.5, 0), (0.5, 0.5), (0, 0.5)])  # < 1 mm2
    assert all_chains_for_geom(tiny) == []


def test_cobertura_do_pitch():
    """Espiral deve ter niveis ate o miolo: raio/STEP niveis aproximadamente."""
    square = Polygon([(0, 0), (50, 0), (50, 50), (0, 50)])
    chains = build_spiral_chains(square)
    xs = [p[0] for p in chains[0]]
    # o ponto mais interno deve chegar perto do centro (ultimo offset < STEP*2 do centro)
    assert min(abs(x - 25) for x in xs) < STEP * 2
