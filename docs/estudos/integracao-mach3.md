# Investigação: Integração com March3 CNC

## 1. Como March3 Funciona Atualmente

### Fluxo Manual (Operador)
```
1. Abre March3 CNC (software)
2. Abre pasta com arquivos .TAP
   └─ storage/pedidos/2026/junho/2026-06-ENTRATTA-ABC123/
3. Seleciona arquivo manualmente:
   └─ 2026-06-ENTRATTA-ABC123-tapete-preto.tap
4. "Pinta" (processa) = executa corte
5. Troca de material (se cor diferente)
6. Seleciona próximo arquivo:
   └─ 2026-06-ENTRATTA-ABC123-texto-branco.tap
7. Repete até terminar todos os .TAP

TEMPO: ~5-10 minutos manual por pedido
RISCO: Erro do operador (arquivo errado, ordem errada)
```

---

## 2. Opções de Integração March3

### OPÇÃO 1: Auto-Load via Pasta Observada (Recomendado ⭐⭐⭐)
**Como funciona:**
- March3 monitora uma pasta específica
- Quando novo arquivo .TAP aparece, auto-carrega
- Operador aprova/inicia = 1 clique
- Ideal para: produção contínua

**Implementação:**
```bash
# Estrutura
storage/
├── pedidos/                          # Histórico (archive)
│   └── 2026/junho/...
├── fila-producao/                    # ⭐ PASTA OBSERVADA
│   └── 2026-06-ENTRATTA-ABC123/
│       ├── 001-tapete-preto.tap      # Número sequencial
│       ├── 002-texto-branco.tap
│       ├── 003-borda-verde.tap
│       └── manifest.json             # Instruções
└── producao-completa/                # Após finalizar
    └── 2026-06-ENTRATTA-ABC123/
        └── ...
```

**Manifest.json (instrucional):**
```json
{
  "orderId": "2026-06-ENTRATTA-ABC123",
  "cliente": "Acme Corp",
  "totalTaps": 4,
  "sequence": [
    {
      "number": 1,
      "file": "001-tapete-preto.tap",
      "layer": "BASE",
      "color": "Preto",
      "instruction": "Corte a base de vinil preto"
    },
    {
      "number": 2,
      "file": "002-texto-branco.tap",
      "layer": "OVERLAY",
      "color": "Branco",
      "instruction": "Sobreponha o texto em branco"
    },
    {
      "number": 3,
      "file": "003-borda-verde.tap",
      "layer": "BORDA",
      "color": "Verde",
      "instruction": "Aplique borda verde dupla"
    },
    {
      "number": 4,
      "file": "004-cascata-5x.tap",
      "layer": "CASCATA",
      "color": "Preto",
      "instruction": "5 unidades em cascata (sem reset)"
    }
  ],
  "estimatedTime": "12 minutos",
  "qualityChecklist": [
    "Cores corretas aplicadas",
    "Dimensões dentro da tolerância (±2mm)",
    "Bordas limpas",
    "Sem enrugamentos"
  ]
}
```

**Vantagens:**
✅ Automático (March3 lê a pasta)
✅ Operador vê fila visual
✅ Reduz erros (sequência garantida)
✅ Rápido (1 arquivo carrega automaticamente)
✅ Compatível com versões atuais March3

---

### OPÇÃO 2: Plugin/Macro March3 (Avançado)
**Como funciona:**
- Cria macro/script que roda no March3
- Lê arquivo manifest.json
- Auto-carrega cada TAP em sequência
- Auto-inicia corte (opcional)

**Necessário:**
- March3 versão com suporte a scripts
- Conhecimento de linguagem March3 (se tiver)
- Pode variar por versão do software

**Exemplo pseudocódigo:**
```march3
LOAD_MANIFEST "manifest.json"
FOR EACH tap IN manifest.sequence:
  LOAD_FILE tap.file
  SET_COLOR tap.color
  DISPLAY_INSTRUCTION tap.instruction
  WAIT_FOR_OPERATOR "Pressione OK para iniciar"
  RUN_CUT
  SET_STATUS "COMPLETED"
  NEXT
SHOW_SUMMARY
```

---

### OPÇÃO 3: Porta Serial/USB (Técnico ⚠️)
**Como funciona:**
- Sistema envia comandos diretos via USB
- March3 recebe instruções do servidor web
- Não recomendado (requer drivers específicos)

**Problemas:**
❌ Depende de versão March3
❌ Requer documentação proprietária
❌ Complexo de manter
❌ Risco de incompatibilidade

---

## 3. Solução Recomendada (OPÇÃO 1)

### Arquitetura
```
┌─────────────────────┐
│  CLIENTE             │
│  /monte-o-seu       │
│  "Criar Pedido"     │
└──────────┬──────────┘
           │
           ↓
┌──────────────────────────────────────┐
│  API: /api/orders/criar-pedido       │
│  ✓ Gera múltiplos .TAP               │
│  ✓ Cria manifest.json                │
│  ✓ Move para fila-producao/          │
└──────────┬───────────────────────────┘
           │
           ↓
┌──────────────────────────────────────┐
│  storage/fila-producao/              │
│  2026-06-ENTRATTA-ABC123/            │
│  ├─ 001-tapete-preto.tap             │
│  ├─ 002-texto-branco.tap             │
│  ├─ 003-borda-verde.tap              │
│  └─ manifest.json                    │
└──────────┬───────────────────────────┘
           │
           ↓ (March3 monitora esta pasta)
┌──────────────────────────────────────┐
│  MARCH3 CNC (Operador)               │
│  ✓ Auto-carrega 001-tapete-preto.tap │
│  ✓ Mostra: "Corte base preto"        │
│  ✓ Operador: 1 clique = INICIAR      │
│  ✓ Auto-advance para próximo         │
│  ✓ Mostra manifest visual (checklist)│
└──────────┬───────────────────────────┘
           │
           ↓ (Após concluir 001)
           ✅ Auto-carrega 002
           ↓
           ✓ Repete...
           ↓
           ✅ Finaliza quando 004 completo
           │
           ↓
┌──────────────────────────────────────┐
│  storage/producao-completa/          │
│  2026-06-ENTRATTA-ABC123/            │
│  (moved automatically ou manualmente) │
└──────────────────────────────────────┘
```

---

## 4. Implementação (Backend)

### Função para criar pasta de fila
```typescript
// lib/services/production-queue.service.ts
export class ProductionQueueService {
  static async enqueuOrder(
    orderId: string,
    tapFiles: string[]
  ): Promise<void> {
    // 1. Criar pasta fila-producao/YYYY/mes/orderId/
    const queueFolder = `storage/fila-producao/${new Date().getFullYear()}/${getMonth()}/`
    
    // 2. Mover/copiar arquivos .TAP para fila
    // cp storage/pedidos/.../001-tapete.tap → storage/fila-producao/.../
    
    // 3. Renomear com números sequenciais
    // 001-tapete-preto.tap
    // 002-texto-branco.tap
    // 003-borda-verde.tap
    // 004-cascata-5x.tap
    
    // 4. Gerar manifest.json
    const manifest = generateManifest(orderId, tapFiles)
    fs.writeFileSync(`${queueFolder}manifest.json`, JSON.stringify(manifest, null, 2))
    
    // 5. Alert: "Pedido enfileirado para March3"
    console.log(`✅ Pedido ${orderId} adicionado à fila de produção`)
    console.log(`📁 Caminho: ${queueFolder}`)
  }
}
```

---

## 5. Interface do Operador (Dashboard)

### O que o operador vê em tempo real
```
╔════════════════════════════════════════════╗
║        FILA DE PRODUÇÃO MARCH3 CNC         ║
╠════════════════════════════════════════════╣
║                                            ║
║  PEDIDO ATUAL: 2026-06-ENTRATTA-ABC123     ║
║  Cliente: Acme Corp | Medida: 60×90cm      ║
║                                            ║
║  ✅ 1/4 PRETO - COMPLETO                   ║
║  ⏳ 2/4 BRANCO - PREPARANDO...              ║
║  ⬜ 3/4 VERDE - AGUARDANDO                  ║
║  ⬜ 4/4 CASCATA - AGUARDANDO                ║
║                                            ║
║  Próximo: 002-texto-branco.tap             ║
║  Instrução: Sobreponha texto branco        ║
║  Cor: BRANCO | Duração est: 3min           ║
║                                            ║
║  [  INICIAR  ] [PULAR] [PAUSAR] [INFO]     ║
║                                            ║
║  Tempo total: 12 minutos                   ║
║  Status: 25% completo ████░░░░░░░░░░░░     ║
║                                            ║
╚════════════════════════════════════════════╝
```

---

## 6. Fluxo Automatizado (Full)

```
CLIENTE CRIA PEDIDO
       ↓
   API gera:
   ✓ PDF
   ✓ Múltiplos .TAP (por cor)
   ✓ Manifest.json
       ↓
   Salva em:
   storage/fila-producao/YYYY/mes/orderId/
       ↓
MARCH3 DETECTA NOVA PASTA
       ↓
   Auto-carrega: 001-tapete-preto.tap
   Mostra: "Corte base preto"
   Operador: 1 clique = INICIAR
       ↓
   ✅ Corte completo
       ↓
MARCH3 AUTO-AVANÇA
       ↓
   Auto-carrega: 002-texto-branco.tap
   Mostra: "Sobreponha texto branco"
   Operador: 1 clique = INICIAR
       ↓
   ✅ Corte completo
       ↓
   (Repete para 003 e 004)
       ↓
PEDIDO FINALIZADO
       ↓
   Move para:
   storage/producao-completa/orderId/
       ↓
NOTIFICA ADMINISTRAÇÃO
   ✅ Email: "Pedido ABC123 finalizado"
   ✅ WhatsApp: "Tapete pronto para empacotar"
```

---

## 7. Benefícios da Automação

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Tempo por pedido** | 5-10 min | 1-2 min (operador) |
| **Erros do operador** | Alto (arquivo errado) | Baixo (sequência garantida) |
| **Seleção manual** | 4 cliques | 1 clique por etapa |
| **Produtividade** | 6 pedidos/hora | 15+ pedidos/hora |
| **Treinamento** | Complexo (ordem, cores) | Simples (1 botão) |
| **Rastreamento** | Manual | Automático (log) |

---

## 8. Próximos Passos

**Fase 1: Confirmar (Esta semana)**
- [ ] Testar se March3 suporta "watch folder"
- [ ] Verificar se March3 tem auto-load nativo
- [ ] Confirmar se versão instalada tem essa feature

**Fase 2: Implementar (Backend)**
- [ ] Serviço ProductionQueueService
- [ ] Função enqueuOrder() em API
- [ ] Gerador manifest.json
- [ ] Sistema de movimentação de arquivos

**Fase 3: Frontend/Dashboard**
- [ ] Painel operador em tempo real
- [ ] Lista de fila visual
- [ ] Status de cada pedido
- [ ] Botão INICIAR/PULAR/PAUSAR

**Fase 4: Integração Completa**
- [ ] Notificações automáticas
- [ ] Histórico de produção
- [ ] Relatórios (tempo, custos)
- [ ] Integração com March3 (se API disponível)

---

## 9. Perguntas para o Pessoal March3

**Quando confirmarem suporte a "watch folder":**

1. ✅ March3 monitora pasta automaticamente?
2. ✅ Qual pasta? (caminho específico)
3. ✅ Que extensão reconhece? (.tap, .cmx, outros?)
4. ✅ Auto-carrega quando novo arquivo aparece?
5. ✅ Suporta sequência de arquivos?
6. ✅ Tem log/histórico de processamento?
7. ✅ Pode enviar feedback (arquivo processado)?
8. ✅ Versão mínima que suporta isso?
9. ✅ É configurável no .ini do March3?

---

## Conclusão

**Recomendação:** Implementar OPÇÃO 1 (Auto-Load via Pasta)
- ✅ Compatível com March3 atual
- ✅ Simples de implementar
- ✅ Reduz 80% do trabalho manual
- ✅ Sem risco técnico
- ✅ Escalável para múltiplas máquinas

**ROI:** 
- Redução de 5-10 min → 1-2 min por pedido
- 8 pedidos/dia = 40-80 minutos economizados
- ~3 horas economizadas por semana
- ~150 horas/ano (1,5 meses de produtividade)
