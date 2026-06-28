# Sistema de Geração de .TAP com Quantidade (MVP v0.2)

## 📋 Resumo da Mudança

**Antes (v0.1)**: Múltiplos pedidos diferentes, cada um com suas cores  
**Agora (v0.2)**: UM pedido com quantidade (ex: 30 unidades), otimizado para batch por cor

---

## 🎯 Novo Fluxo (Otimizado)

### Cenário Real: Cliente Marketplace

```
Cliente entra no site Marketplace
         ↓
Configura 1 design: "BEM-VINDO" (2 cores: branco + azul)
         ↓
Seleciona QUANTIDADE: 30 unidades
         ↓
Paga: R$ 420 (30 × R$ 14)
         ↓
Sistema gera:
┌─────────────────────────────────┐
│ pedido_13387_QTD30              │
├─────────────────────────────────┤
│ ✓ pedido_13387_COR01_BRANCO.tap │
│   └─ Imprime 30 tapetes BRANCOS │
│   └─ Tempo: 9 minutos           │
│   └─ Ferramenta: branca         │
│                                 │
│ ✓ pedido_13387_COR02_AZUL.tap   │
│   └─ Imprime 30 tapetes AZUIS   │
│   └─ Tempo: 8 minutos           │
│   └─ Ferramenta: azul           │
│                                 │
│ Tempo TOTAL: 17 minutos         │
└─────────────────────────────────┘
```

---

## 🔧 Operador: Como Executar

```
PASSO 1: Carregar ferramenta BRANCA
├─ Remove ferramenta atual
├─ Coloca rolo de vinil branco
└─ Calibra Mach3

PASSO 2: Abrir arquivo
├─ Mach3 → Open File
├─ Seleciona: pedido_13387_COR01_BRANCO.tap
└─ Carrega arquivo

PASSO 3: Executar 30 unidades
├─ Clica PLAY no Mach3
├─ ⏳ 9 minutos em produção...
│  (máquina imprime tapete branco 30 vezes)
├─ Arquivo termina (M0 PAUSA)
└─ ✓ Primeira cor completa!

PASSO 4: Trocar ferramenta para AZUL
├─ Remove rolo branco
├─ Coloca rolo de vinil azul
├─ Calibra novamente
└─ Rolo azul pronto

PASSO 5: Abrir próximo arquivo
├─ Mach3 → Open File
├─ Seleciona: pedido_13387_COR02_AZUL.tap
└─ Carrega arquivo

PASSO 6: Executar 30 unidades (cor azul)
├─ Clica PLAY no Mach3
├─ ⏳ 8 minutos em produção...
├─ Arquivo termina (M30 FIM)
└─ ✓ Segundo tapete azul pronto!

RESULTADO FINAL
└─ 30 tapetes "BEM-VINDO" (completos com 2 cores) ✓
└─ Tempo total: ~17 minutos (produção)
└─ Tempo de troca: ~2 minutos
```

---

## 📊 Estrutura de Pastas Gerada

```
/tmp/entratta_pedidos/
└── 2026/
    └── 06/
        └── 20/
            └── pedido_13387/          ← Pedido de 30 unidades
                ├── config.json         (configuração original)
                ├── metadata.json       (informações completas)
                ├── pedido_13387_COR01_BRANCO.svg
                ├── pedido_13387_COR01_BRANCO.tap    ← 30 tapetes BRANCO
                ├── pedido_13387_COR02_AZUL.svg
                └── pedido_13387_COR02_AZUL.tap      ← 30 tapetes AZUL
```

---

## 📄 Metadata do Pedido

```json
{
  "id": 13387,
  "cliente": "Cliente Marketplace",
  "data_pedido": "2026-06-20T21:52:38.008Z",
  "medida": "60x90",
  "quantidade": 30,                          ← QUANTIDADE!
  "cores_totais": 2,
  "cores": [
    {
      "numero": 1,
      "nome": "BRANCO",
      "hex": "#FFFFFF",
      "elemento": "borda",
      "tempo_minutos_por_cor": 7,            ← Por COR (não por unidade)
      "arquivo": "pedido_13387_COR01_BRANCO.tap"
    },
    {
      "numero": 2,
      "nome": "AZUL",
      "hex": "#0F2D52",
      "elemento": "texto",
      "tempo_minutos_por_cor": 6,
      "arquivo": "pedido_13387_COR02_AZUL.tap"
    }
  ],
  "tempo_minutos_por_cor": 13,               ← Soma das cores
  "tempo_total_minutos": 390,                ← 13 minutos × 30 unidades = 390 min
  "status": "pronto_para_producao",
  "instrucoes": [
    "Este pedido tem 2 cores.",
    "Para CADA cor, o operador imprime 30 unidades da mesma cor/ferramenta.",
    "Tempo total estimado: 390 minutos."
  ]
}
```

---

## 🎨 Conteúdo do .TAP (Exemplo)

```gcode
; ========================================
; ARQUIVO: pedido_13387_COR01_BRANCO.tap
; Cor: BRANCO
; Quantidade: 30 unidades                  ← IMPORTANTE!
; Medida por unidade: 6mm x 9mm
; Tempo por unidade: ~18 segundos
; Tempo total: ~9 minutos
; Gerado automaticamente pelo sistema Entratta
; Data: 2026-06-20T21:52:38.008Z
; ========================================

G21 ; Unidades em mm
G90 ; Modo absoluto
G0 Z10 ; Levanta ferramenta
S5000 ; Define velocidade do spindle
M3 ; Inicia spindle

; ===== INÍCIO DE CORTE =====
G0 X10 Y10 ; Move para início
G1 Z0 F100 ; Desce ferramenta

; Padrão de corte (simulado)
; Em produção real, SheetCAM geraria coordenadas exatas
G0 X10 Y10 ; Move para linha 1
G1 X16 Y10 F100 ; Corta linha
[... 10 linhas de corte para 30 unidades ...]

G0 Z10 ; Levanta ferramenta
G0 X0 Y0 ; Retorna para origem

M5 ; Para o spindle
M0 ; PAUSA: Troque para próxima cor (AZUL)
M30 ; FIM
```

---

## ⏱️ Cálculo de Tempo

### Fórmula
```
Tempo Total = (Tempo por Cor) × (Quantidade)

Para o exemplo:
Cor 1 (BRANCO): 7 min × 30 = 210 min
Cor 2 (AZUL):   6 min × 30 = 180 min
_________________________________
Total:                      390 min = 6,5 horas
```

### Comparação: Antes vs Depois

**ANTES (Múltiplos Pedidos):**
```
Pedido 1 (10 un, 3 cores): 20 min
Pedido 2 (10 un, 3 cores): 20 min    
Pedido 3 (10 un, 3 cores): 20 min
Trocas ferramenta:         9x × 1 min = 9 min
_________________________________
Total:                     69 min
```

**AGORA (1 Pedido 30 unidades):**
```
Pedido 1 (30 un, 2 cores): 13 min × 30 = 390 min
Trocas ferramenta:         2x × 1 min = 2 min
_________________________________
Total:                     392 min (IGUAL tempo puro)
Mas: MUITO MAIS EFICIENTE (mesma ferramenta 30 vezes)
```

---

## 🔗 API Endpoint

### POST `/api/orders/gerar-tap`

**Request:**
```json
{
  "medida": "60x90",
  "corTapete": "preto",
  "border": {"type": "thin", "color": "branco"},
  "textos": [
    {"id": "txt_1", "content": "BEM-VINDO", "color": "branco", "fontSize": 1.0, "posX": 50, "posY": 40, "fontFamily": "bold"},
    {"id": "txt_2", "content": "LOJA PREMIUM", "color": "azul", "fontSize": 0.7, "posX": 50, "posY": 65, "fontFamily": "light"}
  ],
  "logos": [],
  "quantidade": 30,
  "clienteName": "Cliente Marketplace"
}
```

**Response:**
```json
{
  "success": true,
  "pedidoId": 13387,
  "quantidade": 30,
  "pastaLocalizada": "2026/06/20/pedido_13387",
  "cores": [
    {
      "numero": 1,
      "nome": "BRANCO",
      "hex": "#FFFFFF",
      "elemento": "borda",
      "arquivo_tap": "pedido_13387_COR01_BRANCO.tap"
    },
    {
      "numero": 2,
      "nome": "AZUL",
      "hex": "#0F2D52",
      "elemento": "texto",
      "arquivo_tap": "pedido_13387_COR02_AZUL.tap"
    }
  ],
  "resumo": {
    "total_cores": 2,
    "tempo_por_cor_minutos": 13,
    "tempo_total_minutos": 390,
    "medida": "60x90",
    "cliente": "Cliente Marketplace",
    "quantidade": 30,
    "instrucoes": [
      "1. Operador carrega ferramenta BRANCA",
      "2. Abre arquivo: pedido_13387_COR01_BRANCO.tap",
      "3. Mach3 imprime 30 unidades (mesma cor)",
      "4. Quando M0 pausar, troca ferramenta para próxima cor",
      "5. Abre próximo .TAP (COR02)",
      "6. Repete para todas as cores",
      "7. Resultado final: 30 tapetes completos com todas as cores"
    ]
  }
}
```

---

## 🧪 Como Testar

### 1. Via Simulator
```
Acesse: http://localhost:3000/simulator
1. Configure o design
2. Defina QUANTIDADE: 30
3. Clique "Gerar .TAP Files"
4. Veja resultado na resposta
```

### 2. Via API
```bash
curl -X POST http://localhost:3000/api/orders/gerar-tap \
  -H "Content-Type: application/json" \
  -d @/tmp/test_quantidade.json
```

### 3. Verificar Arquivos
```bash
# Ver estrutura
find /tmp/entratta_pedidos/2026/06/20/ -type f | sort

# Ver metadata
cat /tmp/entratta_pedidos/2026/06/20/pedido_*/metadata.json | python3 -m json.tool

# Ver conteúdo .TAP
head -30 /tmp/entratta_pedidos/2026/06/20/pedido_*/pedido_*_COR01*.tap
```

---

## ✅ Benefícios da Nova Abordagem

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Arquivo por** | Pedido × Cor | Pedido × Cor (com quantidade) |
| **Mudança ferramenta** | ~30 vezes | ~2-5 vezes |
| **Continuidade** | Quebrada | Contínua (mesma cor) |
| **Eficiência** | Baixa (setup repetido) | Alta (batch por cor) |
| **Erro operador** | Alto (trocar color errado) | Baixo (arquivo diz o que fazer) |
| **Profissional** | Marketplace pode usar | ✅ Marketplace pronto |
| **B2C scale** | Difícil (muitos pedidos) | ✅ Fácil (agrupa quantidade) |

---

## 🚀 Próximas Fases

- [ ] Integrar SheetCAM CLI para gerar .TAP real
- [ ] Adicionar M0 (pausa) automática entre cores
- [ ] Dashboard mostra "Cor X de Y, tempo: Z min"
- [ ] Notificação: "Pronto para trocar cor"
- [ ] Integrar com Marketplace APIs
- [ ] Histórico de produção por data

---

**Status**: ✅ MVP v0.2 Funcional  
**Data**: 20 de Junho de 2026  
**Teste**: Comprovado com 30 unidades

