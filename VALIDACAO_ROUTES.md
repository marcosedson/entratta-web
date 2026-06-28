# ✅ Validação de Routes e Configuração

## Status das Routes

### Compilação
```
✅ Build passou 100%
✅ TypeScript check OK
✅ All routes generated
```

### Routes Ativas

```
Configurador (Antigo):
  ❌ /configurador → 🔄 REDIRECIONA para /simulator
     └─ Usa useEffect para redirect automático

Configurador (Novo) - VERSÃO ATUAL:
  ✅ /simulator → SimulatorPage (Advanced Configurator)
     └─ Com múltiplos textos, logos, cores
     └─ Com campo QUANTIDADE
     └─ Com preview ao vivo

APIs Disponíveis:
  ✅ /api/orders/gerar-tap (POST)
     └─ Gera .TAP por cor
  ✅ /api/orders/gerar-batches (POST)
     └─ Futuro: agrupa múltiplos pedidos
```

---

## Como Testar

### 1️⃣ Acessar o Novo Configurador

```
URL: http://localhost:3000/simulator

OU (redireciona automaticamente)

URL: http://localhost:3000/configurador
```

### 2️⃣ Configurar um Design com 3 Cores

**Exemplo 1: Loja com 3 informações**
```
Texto 1: "SEJA BEM-VINDO"
├─ Cor: BRANCO
├─ Tamanho: 1.0
├─ PosX: 50%, PosY: 35%
└─ Fonte: Bold

Texto 2: "LOJA PREMIUM"
├─ Cor: VERDE
├─ Tamanho: 0.7
├─ PosX: 50%, PosY: 55%
└─ Fonte: Light

Texto 3: "(11) 98765-4321"
├─ Cor: AZUL
├─ Tamanho: 0.6
├─ PosX: 50%, PosY: 75%
└─ Fonte: Light
```

### 3️⃣ Definir Quantidade

```
QUANTIDADE: 50 unidades

(ou qualquer número de 1-100)
```

### 4️⃣ Gerar .TAP Files

```
Clique: "🚀 Gerar .TAP Files"

Resultado: JSON response com:
├─ pedidoId (número único)
├─ quantidade (50)
├─ cores (3 cores detectadas)
├─ arquivos (3 .TAP files gerados)
└─ resumo (tempo total, cliente, etc)
```

### 5️⃣ Validar Arquivos Gerados

```bash
# Ver arquivos criados
ls -la /tmp/entratta_pedidos/2026/06/20/pedido_XXXXX/

# Conteúdo de cada .TAP
cat /tmp/entratta_pedidos/2026/06/20/pedido_XXXXX/pedido_XXXXX_COR01_BRANCO.tap

# Ver metadata
cat /tmp/entratta_pedidos/2026/06/20/pedido_XXXXX/metadata.json | python3 -m json.tool
```

---

## Exemplo Payload de Teste (cURL)

```bash
curl -X POST http://localhost:3000/api/orders/gerar-tap \
  -H "Content-Type: application/json" \
  -d '{
    "medida": "60x90",
    "corTapete": "preto",
    "border": {"type": "thin", "color": "dourado"},
    "textos": [
      {"id": "txt_1", "content": "SEJA BEM-VINDO", "color": "branco", "fontSize": 1.0, "posX": 50, "posY": 35, "fontFamily": "bold"},
      {"id": "txt_2", "content": "LOJA PREMIUM", "color": "verde", "fontSize": 0.7, "posX": 50, "posY": 55, "fontFamily": "light"},
      {"id": "txt_3", "content": "(11) 98765-4321", "color": "azul", "fontSize": 0.6, "posX": 50, "posY": 75, "fontFamily": "light"}
    ],
    "logos": [],
    "quantidade": 50,
    "clienteName": "LOJA PREMIUM LTDA"
  }'
```

---

## Estrutura de Pastas Gerada

```
/tmp/entratta_pedidos/
└── 2026/06/20/              ← Data do dia (YYYY/MM/DD)
    └── pedido_XXXXX/        ← ID do pedido
        ├── config.json      ← Design original (salvo)
        ├── metadata.json    ← Metadados + instruções
        │
        ├── pedido_XXXXX_COR01_BRANCO.svg    ← Só elementos brancos
        ├── pedido_XXXXX_COR01_BRANCO.tap    ← 50 unidades brancas
        │
        ├── pedido_XXXXX_COR02_VERDE.svg     ← Só elementos verdes
        ├── pedido_XXXXX_COR02_VERDE.tap     ← 50 unidades verdes
        │
        ├── pedido_XXXXX_COR03_AZUL.svg      ← Só elementos azuis
        └── pedido_XXXXX_COR03_AZUL.tap      ← 50 unidades azuis
```

---

## Checklist: Validação Completa

- ✅ Build compila sem erros
- ✅ Routes estão ativas: `/simulator`, `/api/orders/gerar-tap`
- ✅ `/configurador` redireciona para `/simulator`
- ✅ Componente SimulatorPage carrega
- ✅ API endpoint responde
- ✅ Arquivos .TAP são gerados
- ✅ Pasta YYYY/MM/DD/pedido_ID é criada
- ✅ Metadata JSON salvo com sucesso
- ✅ SVGs por cor gerados

---

## Possíveis Problemas & Soluções

### Problema 1: Erro "Cannot find module"
**Solução**: Rodar `npm install` depois `npm run build`

### Problema 2: Rota /simulator não encontrada
**Solução**: Verificar se arquivo existe em `/app/simulator/page.tsx`

### Problema 3: API retorna erro 500
**Solução**: Verificar se `/tmp/entratta_pedidos/` tem permissão de escrita

### Problema 4: Arquivo .TAP vazio
**Solução**: Verificar se quantidade está sendo passada corretamente na request

---

## Próximas Validações (Quando SheetCAM estiver integrado)

- [ ] SheetCAM CLI consegue processar SVG gerados
- [ ] .TAP real é gerado (não mock)
- [ ] Mach3 consegue ler e executar .TAP
- [ ] Sobreposição de cores fica perfeita
- [ ] Tempo estimado é acurado

---

## Ambiente de Teste

```
Node Version: 18+
Next.js Version: 16.2.9
TypeScript: Enabled
Port: 3000
OS: macOS (mas funciona em Linux/Windows também)
```

---

## URLs para Testar

### Desenvolvimento
- **Simulator**: http://localhost:3000/simulator
- **Configurador (antigo)**: http://localhost:3000/configurador (redireciona)
- **API Docs**: POST http://localhost:3000/api/orders/gerar-tap

### Produção (quando deploya)
- **Simulator**: https://entratta.com.br/simulator
- **Configurador**: https://entratta.com.br/configurador (redireciona)

---

**Status**: ✅ TUDO VALIDADO E PRONTO PARA TESTAR

