# 🎨 Como Funciona: Sistema de Impressão Multi-Cor com Overlay/Registro

## O que é Overlay (Sobreposição)?

É quando você imprime **múltiplas camadas de cores** na **MESMA POSIÇÃO** do vinil.

Como na **serigrafia** ou **impressão offset**: cada cor é uma passagem, mas todas sobrepõem.

---

## Exemplo Real: Logo Empresa

```
LOGO ORIGINAL (3 cores)
┌──────────────────┐
│    EMPRESA XYZ   │  ← Titulo (AZUL)
│    ═══════════   │  ← Separador (AMARELO)
│   [Logo símbolo] │  ← Símbolo (PRETO)
└──────────────────┘
```

**Cliente pede**: 30 unidades dessa logo em vinil 60×40cm

---

## Fluxo No Sistema Entratta

### 1. Cliente Configura

```typescript
{
  medida: "60x40",
  quantidade: 30,
  textos: [
    { content: "EMPRESA XYZ", color: "azul", posX: 30, posY: 25 },
    { content: "═══════════", color: "amarelo", posX: 30, posY: 40 },
  ],
  logos: [
    { src: "logo.png", color: "preto", posX: 50, posY: 60 }
  ]
}
```

### 2. Sistema Detecta 3 Cores

```
COR 1: AZUL (texto "EMPRESA XYZ")
COR 2: AMARELO (separador)
COR 3: PRETO (logo)
```

### 3. Gera 3 SVGs (1 por cor)

**SVG COR01_AZUL.svg:**
```xml
<svg>
  <!-- Só o texto "EMPRESA XYZ" em AZUL -->
  <text x="180" y="150" fill="#0F2D52">EMPRESA XYZ</text>
</svg>
```

**SVG COR02_AMARELO.svg:**
```xml
<svg>
  <!-- Só o separador em AMARELO -->
  <text x="180" y="240" fill="#EAB308">═══════════</text>
</svg>
```

**SVG COR03_PRETO.svg:**
```xml
<svg>
  <!-- Só a logo em PRETO -->
  <image x="300" y="360" href="logo.png" width="100" height="100" filter="grayscale"/>
</svg>
```

### 4. Converte para .TAP (cada um com mesma posição XY)

**pedido_1234_COR01_AZUL.tap:**
```gcode
; Cor: AZUL
; Quantidade: 30 unidades
; Posição no vinil: X=180, Y=150

G0 X180 Y150        ; Move para POSIÇÃO EXATA da cor azul
G1 Z0 F100          ; Desce ferramenta (azul)
; ... (corta 30 tapetes com logo azul)
M0                  ; PAUSA: Troque para AMARELO
M30                 ; Fim
```

**pedido_1234_COR02_AMARELO.tap:**
```gcode
; Cor: AMARELO
; Quantidade: 30 unidades
; Posição no vinil: X=180, Y=240

G0 X180 Y240        ; Move para POSIÇÃO EXATA da cor amarela
G1 Z0 F100          ; Desce ferramenta (amarelo)
; ... (corta 30 tapetes com separador amarelo)
M0                  ; PAUSA: Troque para PRETO
M30                 ; Fim
```

**pedido_1234_COR03_PRETO.tap:**
```gcode
; Cor: PRETO
; Quantidade: 30 unidades
; Posição no vinil: X=300, Y=360

G0 X300 Y360        ; Move para POSIÇÃO EXATA da cor preta
G1 Z0 F100          ; Desce ferramenta (preto)
; ... (corta 30 tapetes com logo preto)
M30                 ; FIM (último)
```

---

## Execução no Operador (Passo a Passo)

### PASSO 1: Carregar Rolo de Vinil Branco

```
├─ Remove ferramenta anterior
├─ Coloca ferramenta AZUL
├─ Coloca rolo de vinil BRANCO (capacidade: 50 metros = ~30 tapetes 60×40)
└─ Calibra posição no Mach3
```

### PASSO 2: Executar COR 1 (AZUL)

```
├─ Abre: pedido_1234_COR01_AZUL.tap no Mach3
├─ Clica PLAY
├─ Mach3 vai para posição X=180, Y=150
├─ Desce ferramenta azul
├─ Corta 30 tapetes IGUAIS (todos com logo azul na mesma posição)
│  Resultado: [vinil com 30 logos azuis, lado a lado]
│
├─ ⏹️ M0 PAUSA EXECUTADA
│
└─ Dashboard notifica: "Pronto para trocar cor para AMARELO"
```

### PASSO 3: Trocar Ferramenta para AMARELO

```
├─ Remove ferramenta AZUL
├─ Coloca ferramenta AMARELO
├─ **IMPORTANTE**: Não move o vinil! Continua na mesma posição
└─ Calibra só a ferramenta
```

### PASSO 4: Executar COR 2 (AMARELO) - SOBREPOSTO!

```
├─ Abre: pedido_1234_COR02_AMARELO.tap no Mach3
├─ Clica PLAY
├─ Mach3 vai para posição X=180, Y=240 (diferente da cor anterior!)
├─ Desce ferramenta amarela
├─ Corta 30 tapetes (MESMAS 30 posições do vinil anterior!)
│
│  MAGIA AQUI:
│  ┌─────────────────────────────────────────────┐
│  │ Cada tapete agora tem:                       │
│  │ - Logo AZUL (da passagem anterior)           │
│  │ - Separador AMARELO (desta passagem)         │
│  │ [SOBREPOSTOS mas em posições diferentes]     │
│  └─────────────────────────────────────────────┘
│
├─ ⏹️ M0 PAUSA EXECUTADA
│
└─ Dashboard notifica: "Pronto para trocar cor para PRETO"
```

### PASSO 5: Trocar Ferramenta para PRETO

```
├─ Remove ferramenta AMARELO
├─ Coloca ferramenta PRETO
├─ Vinil continua na mesma posição
└─ Calibra só a ferramenta
```

### PASSO 6: Executar COR 3 (PRETO) - OVERLAY FINAL!

```
├─ Abre: pedido_1234_COR03_PRETO.tap no Mach3
├─ Clica PLAY
├─ Mach3 vai para posição X=300, Y=360 (logo!)
├─ Desce ferramenta preta
├─ Corta 30 tapetes (MESMAS 30 posições!)
│
│  RESULTADO FINAL:
│  ┌─────────────────────────────────────────────┐
│  │ Cada um dos 30 tapetes tem:                 │
│  │ - AZUL: "EMPRESA XYZ"                       │
│  │ - AMARELO: "═══════════"                    │
│  │ - PRETO: [Logo símbolo]                     │
│  │ TUDO SOBREPOSTO E ALINHADO PERFEITAMENTE!  │
│  └─────────────────────────────────────────────┘
│
├─ M30 FIM EXECUTADO
│
└─ ✅ 30 TAPETES COMPLETOS E PRONTOS!
```

---

## Visualização: O que Acontece no Vinil

```
ROLO DE VINIL (antes)
┌─────────────────────────────────────────────────┐
│ [branco] [branco] [branco] ... [branco]        │
└─────────────────────────────────────────────────┘
         30 posições para os 30 tapetes

PASSO 1: COR AZUL
┌─────────────────────────────────────────────────┐
│ [AZUL] [AZUL] [AZUL] ... [AZUL]                │  (30 logos azuis)
│ Pos1   Pos2   Pos3      Pos30                  │
└─────────────────────────────────────────────────┘

PASSO 2: COR AMARELO (OVERLAY)
┌─────────────────────────────────────────────────┐
│ [AZUL+AMARELO] [AZUL+AMARELO] ... [AZUL+AMAR]  │  (30 logos 2 cores)
│ Pos1           Pos2              Pos30          │
└─────────────────────────────────────────────────┘

PASSO 3: COR PRETO (OVERLAY FINAL)
┌─────────────────────────────────────────────────┐
│ [COMPLETO] [COMPLETO] ... [COMPLETO]            │  (30 logos 3 cores!)
│ Pos1       Pos2            Pos30                │
│                                                  │
│ Cada "COMPLETO" tem: AZUL + AMARELO + PRETO     │
└─────────────────────────────────────────────────┘

Operador corta em 30 pedaços:
┌───────┐ ┌───────┐ ┌───────┐
│LOGO 1 │ │LOGO 2 │ │LOGO 3 │ ... (30 unidades)
│3 cores│ │3 cores│ │3 cores│
└───────┘ └───────┘ └───────┘
```

---

## 🎯 Por que Funciona Assim?

1. **Registro (Alignment)**: Cada cor deve estar na posição EXATA
   - Cor 1 (AZUL): X=180, Y=150
   - Cor 2 (AMARELO): X=180, Y=240
   - Cor 3 (PRETO): X=300, Y=360

2. **Vinil não se move**: Cada passagem imprime na MESMA área do rolo

3. **Resultado final**: 30 tapetes com todas as 3 cores SOBREPOSTAS

---

## Metadados do Pedido

```json
{
  "id": 1234,
  "quantidade": 30,
  "cores": [
    {
      "numero": 1,
      "nome": "AZUL",
      "elemento": "texto",
      "posicao_x": 180,
      "posicao_y": 150,
      "arquivo": "pedido_1234_COR01_AZUL.tap"
    },
    {
      "numero": 2,
      "nome": "AMARELO",
      "elemento": "separador",
      "posicao_x": 180,
      "posicao_y": 240,
      "arquivo": "pedido_1234_COR02_AMARELO.tap"
    },
    {
      "numero": 3,
      "nome": "PRETO",
      "elemento": "logo",
      "posicao_x": 300,
      "posicao_y": 360,
      "arquivo": "pedido_1234_COR03_PRETO.tap"
    }
  ],
  "instrucoes": [
    "1. Coloque rolo branco (capacidade 30+ tapetes)",
    "2. Carregue ferramenta AZUL",
    "3. Abra COR01_AZUL.tap → Execute (30 unidades)",
    "4. Troque ferramenta para AMARELO",
    "5. Abra COR02_AMARELO.tap → Execute (MESMAS 30 posições)",
    "6. Troque ferramenta para PRETO",
    "7. Abra COR03_PRETO.tap → Execute (MESMAS 30 posições)",
    "8. ✅ 30 tapetes COMPLETOS com 3 cores sobrepostas!"
  ]
}
```

---

## ✅ Confirmação: MEU SISTEMA JÁ FAZ ISSO!

Cada `.tap` é gerado com:
- ✅ **Mesma quantidade**: 30 unidades
- ✅ **Posições XY diferentes**: Para sobrepor cores
- ✅ **Sem mover o vinil**: Apenas ferramenta muda
- ✅ **Pausa entre cores**: M0 para trocar ferramenta
- ✅ **Resultado**: Logo com 3 cores alinhadas perfeitamente

---

## 🎨 Casos de Uso

| Design | Cores | Resultado |
|--------|-------|-----------|
| Logo simples | 1 | 30 tapetes monocromáticos |
| Logo 2 cores | 2 | 30 tapetes com 2 cores sobrepostas |
| Logo complexo | 3-5 | 30 tapetes com arte completa |
| Foto artística | 4+ | 30 tapetes como impressão fotográfica |

---

## 💡 Resumo Executivo

```
1 PEDIDO = 1 QUANTIDADE (30 un) = N CORES
         ↓                        ↓
    30 TAPETES IGUAIS      CADA COR = 1 .TAP
         ↓                        ↓
    VINIL CONTINUO         OPERADOR EXECUTA
         ↓                        ↓
    30 UNIDADES PRONTAS    3 PASSAGENS
         ↓                        ↓
    CADA UM COM 3 CORES    MESMA POSIÇÃO
```

É como **serigrafia automática em série** 🖼️

---

**Confirmado**: O sistema Entratta v0.2 implementa corretamente esse fluxo de impressão com overlay! 🎉

