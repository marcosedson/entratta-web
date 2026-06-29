# Plano de Implementação: Sistema Completo de Pedidos

## 1. MARCH3 CNC - Investigação e Proposta

### Como funciona March3:
- **Formato de entrada**: Arquivos `.tap` (texto plano com instruções)
- **TAP = Tape Archive Program** - formato específico CNC
- **Leitura**: Software March3 lê arquivo .tap e interpreta:
  - Dimensões (largura × comprimento)
  - Cores (cada cor = camada separada)
  - Sequência de corte (x, y, z coordinates)
  - Velocidade de corte
  - Tipo de material (vinil, papel, etc)

### Proposta Melhorada:
```
PROBLEMA ATUAL: Um arquivo .TAP por pedido
SOLUÇÃO: Um arquivo .TAP por COR USADA

Exemplo Pedido #123:
- Cor tapete: PRETO
- Cores texto/logo: BRANCO + VERDE
- Cores borda: VERDE

Resultado:
- 123-tapete-preto.tap       (camada base - tapete)
- 123-texto-branco.tap       (camada overlay 1)
- 123-logo-verde.tap         (camada overlay 2)
- 123-borda-verde.tap        (camada overlay 3)

Vantagem:
✓ Cada cor processada separadamente
✓ Permite reuso de cores entre pedidos
✓ Facilita fila de produção
✓ Melhor controle de qualidade
```

## 2. Múltiplas Quantidades + Impressão em Cascata

### Proposta:
```
Quando cliente pedir 5 unidades:

OPÇÃO 1: CASCATA (recomendado)
- Corta 5x sequencialmente no mesmo arquivo
- Economiza material (sem reset entre cortes)
- Mais rápido
- Arquivo: 123-quantidade-5-cascata.tap

OPÇÃO 2: BATCH POR COR
- Agrupa por cor antes de cortar
- Ideal quando há múltiplas cores
- Reduz trocas de equipamento
- Arquivo: 123-qty-5-batch-preto.tap, etc

OPÇÃO 3: FILA DE PRODUÇÃO
- Acumula pedidos do dia
- Ordena por cor (otimização)
- Executa em lote
```

### Estrutura de Arquivo .TAP para Múltiplas Unidades:
```
REPEAT 5
  CUT_DESIGN 123
  POSITION_NEXT  // Move para próxima posição
END_REPEAT
```

## 3. Estrutura de Armazenamento de Arquivos

```
storage/
└── pedidos/
    └── 2026/
        └── junho/
            └── 2026-06-ENTRATTA-000123/
                ├── metadata.json
                ├── projeto.pdf
                ├── cliente-msg.txt
                ├── tapete/
                │   └── 123-tapete-preto.tap
                ├── overlay/
                │   ├── 123-texto-branco.tap
                │   ├── 123-logo-verde.tap
                │   └── 123-borda-verde.tap
                └── quantidade/
                    ├── 123-qty-5-cascata.tap
                    ├── 123-qty-5-batch-preto.tap
                    └── 123-qty-5-batch-verde.tap
```

## 4. Fluxo Completo de Pedido

```
┌─ Cliente em /monte-o-seu ────────────────────┐
│ Configura: cor, texto, logo, borda, QTD     │
│ Clica: "Criar Pedido"                        │
└──────────────────┬──────────────────────────┘
                   ↓
┌─ API /criar-pedido ──────────────────────────┐
│ 1. Gera Order ID (2026-06-ENTRATTA-000123) │
│ 2. Cria pasta storage/pedidos/...           │
│ 3. Gera múltiplos .TAP (por cor)            │
│ 4. Gera PDF do projeto                      │
│ 5. Salva metadata.json                      │
│ 6. Retorna resposta                         │
└──────────────────┬──────────────────────────┘
                   ↓
┌─ Notificações ───────────────────────────────┐
│ 1. Email → administracao@entratta.com.br    │
│    - Assunto: Novo pedido #123              │
│    - PDF anexado                            │
│    - Link para dashboard                    │
│                                              │
│ 2. WhatsApp (Evolution API)                 │
│    - Grupo: "Novos Pedidos"                 │
│    - Mensagem + PDF                         │
│    - Número do pedido destacado             │
│                                              │
│ 3. Armazenamento                            │
│    - storage/2026/junho/...                 │
│    - Arquivos .TAP para March3              │
│    - PDF para cliente                       │
└──────────────────┬──────────────────────────┘
                   ↓
┌─ March3 CNC ─────────────────────────────────┐
│ 1. Técnico lê notificação WhatsApp          │
│ 2. Acessa dashboard (busca pedido #123)     │
│ 3. Download arquivo .TAP apropriado         │
│ 4. Carrega em March3:                       │
│    - 123-tapete-preto.tap (base)           │
│    - 123-texto-branco.tap (overlay)        │
│    - 123-borda-verde.tap (borda)           │
│ 5. Configura quantidade (5x cascata)       │
│ 6. Inicia produção                         │
└──────────────────┬──────────────────────────┘
                   ↓
           ✅ Tapete Pronto
```

## 5. Implementação (Ordem de Prioridade)

### FASE 1: Infraestrutura Base
- [ ] Serviço de Email (Resend ou Nodemailer)
- [ ] Integração Evolution WhatsApp API
- [ ] Sistema de armazenamento de arquivos
- [ ] Gerador de múltiplos .TAP (por cor)
- [ ] Metadata JSON para rastreamento

### FASE 2: Otimizações
- [ ] Suporte a múltiplas quantidades
- [ ] Impressão em cascata vs batch
- [ ] Dashboard de pedidos
- [ ] Integração com March3 (leitura de status)

### FASE 3: Produção
- [ ] Fila de produção (ordenação automática)
- [ ] Relatórios de produção
- [ ] Histórico de pedidos
- [ ] Análise de custos por cor

## 6. Template de Email

```
Assunto: Novo Pedido Entratta #2026-06-000123

Olá,

Um novo pedido foi criado no sistema:

📋 Pedido: 2026-06-000123
👤 Cliente: [Nome do cliente]
📞 WhatsApp: [Número]
📐 Medida: 60×90 cm
🎨 Cor Tapete: Preto
💬 Quantidade: 5 unidades

📎 Arquivos para produção:
- PDF: projeto-anexado.pdf
- TAP Base: 123-tapete-preto.tap
- TAP Texto: 123-texto-branco.tap
- TAP Borda: 123-borda-verde.tap
- TAP Cascata (5x): 123-qty-5-cascata.tap

🔗 Dashboard: https://entratta.com.br/admin/pedidos/2026-06-000123

Obrigado,
Sistema Entratta
```

## 7. API Evolution Whatsapp

```
Endpoint: POST https://evo.entratta.com.br/message/sendMedia
{
  "chatId": "grupo-novos-pedidos@g.us",
  "contentType": "image/pdf",
  "filePath": "storage/pedidos/2026/junho/2026-06-000123/projeto.pdf",
  "caption": "📌 Novo Pedido #2026-06-000123\n👤 Cliente: [Nome]\n📐 60×90cm | 🎨 Preto\n💬 5 unidades\n\nArquivos .TAP prontos para March3"
}
```

## 8. Estrutura de Cores Múltiplas

```json
{
  "orderId": "2026-06-000123",
  "colors": {
    "tapete": {
      "id": "preto",
      "label": "Preto",
      "hex": "#1a1a1a",
      "tap": "123-tapete-preto.tap"
    },
    "texto": {
      "id": "branco",
      "label": "Branco",
      "hex": "#FFFFFF",
      "tap": "123-texto-branco.tap"
    },
    "borda": {
      "id": "verde",
      "label": "Verde",
      "hex": "#22C55E",
      "tap": "123-borda-verde.tap"
    }
  },
  "quantidade": 5,
  "producaoMode": "cascata",  // ou "batch"
  "tapFiles": [
    "123-tapete-preto.tap",
    "123-texto-branco.tap",
    "123-borda-verde.tap",
    "123-qty-5-cascata.tap"
  ]
}
```

## 9. Próximos Passos

1. Implementar serviço de email
2. Integrar API Evolution
3. Criar sistema de armazenamento
4. Gerar múltiplos TAP por cor
5. Criar dashboard de pedidos
6. Integrar com March3 (status de produção)
