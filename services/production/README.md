# Serviço de Produção ENTRATTA

Microserviço stateless (FastAPI) que transforma o design do configurador em:
- **`POST /preview`** — PNG fotorrealista determinístico (textura real + tingimento por luminância). É a prévia que o cliente aprova.
- **`POST /generate`** — ZIP com um `.tap` (G-code Mach3) por cor ACI usada. É o que a CNC de aerógrafo executa.
- **`POST /vectorize`** — logo raster (PNG/JPG) ou SVG → regiões vetoriais com cor ACI sugerida por região.

Preview e G-code saem dos **mesmos polígonos** (`app/geometry/regions.py`): o que o cliente aprova é o que a máquina pinta.

## Paleta ACI (imutável — padrão da empresa)

| ACI | Nome | RGB |
|---|---|---|
| 9 | BRANCO | `#EBEBEB` |
| 230 | AMARELO | `#F5C828` |
| 166 | AZUL_ROYAL | `#1E3C96` |
| 30 | LARANJA | `#EB6E1E` |
| 114 | VERDE_BANDEIRA | `#1E7837` |

Não alterar os códigos (`app/palette.py`).

## G-code

Formato validado contra `.tap` reais de produção (fixtures em `tests/fixtures/real_*.tap`):
pitch 1.4mm, F1000 trabalho, F7000 rápido, Z10/Z0.5/Z0 (nunca negativo — só pintura),
M03/M05 liga/desliga aerógrafo, cabeçalho `Mach3 plasma.scpost`, N#### de 10 em 10, CRLF.

Algoritmo (`app/gcode/spiral.py`, porte do protótipo validado):
- Forma **sem furo** → espiral contínua costurada (offset inward, costura pelo par de pontos mais próximo).
- Forma **com furo** → anéis fechados independentes (espiral costurada em forma anular cria saltos atravessando o desenho — não tentar sem resolver a topologia antes).

Paridade medida contra os arquivos reais (comprimento de traço pintado): razão 1.02–1.24 por cor.

## Tamanho e origem física (instrução de processo)

O G-code **não tem campo de tamanho** — as coordenadas XY em mm são o tamanho. O serviço
escala o viewBox do configurador para o retângulo `tamanho_mm` e faz flip Y (SVG cresce
para baixo, mesa para cima).

**X0,Y0 corresponde ao batente físico da mesa.** A manta em branco deve ser posicionada
sempre encostada na mesma referência (batente/marcação na mesa). Se hoje não existe
batente fixo, criar essa marcação antes de rodar produção — sem isso o desenho pode sair
deslocado/fora da peça. ⚠️ Confirmar a referência com a equipe de produção.

## Validação antes de produção real (inegociável)

1. `pytest` (invariantes de formato + paridade contra `.tap` reais).
2. Abrir os `.tap` gerados num simulador (NC Viewer — ncviewer.com — ou CAMotics) e conferir visualmente.
3. Uma passada física de teste na máquina com manta de descarte.

## Dev local

```bash
python3.12 -m venv .venv          # 3.12 — vtracer segfaulta no 3.14
.venv/bin/pip install -r requirements-dev.txt
.venv/bin/pytest
.venv/bin/uvicorn app.main:app --port 8000
```

## Texturas do preview

`app/preview/textures/` — patches 256×256 recortados de fotos reais de produto.
Hoje: `tex_cinza.png`, `tex_verde.png`. Cores de manta sem foto usam a textura cinza
tingida por luminância (fallback aceitável). Ao fotografar novas cores de manta,
recortar patch central e registrar em `BACKGROUND_TEXTURES` (`app/preview/renderer.py`).

## Cobertura de tinta sobre fundo escuro

Não implementado de propósito: ajuste automático de passadas por combinação
tinta×fundo **não foi validado fisicamente**. Validar com a produção antes de
qualquer regra automática.
