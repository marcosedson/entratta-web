# 🚀 Plano de Ação — Próximas Fases

## Situação Atual (v0.2 - Junho 2026)

✅ **Pronto para vender**:
- Configurador funcional (múltiplos textos/logos)
- Geração de .TAP automática
- Cálculo de quantidade
- Estrutura de pastas profissional

❌ **Ainda não implementado**:
- Pagamento (Stripe/MercadoPago)
- Assinatura digital (prova)
- SheetCAM real (agora é mock)
- Dashboard operador
- Notificações

---

## Fase 3: Integração Real (Agosto 2026)

### 3.1: SheetCAM CLI — .TAP Real

**Problema**: Agora geramos g-code fake (mock)  
**Solução**: Integrar SheetCAM headless CLI

```bash
# Command que executaríamos:
sheetcam --input design_COR01_BRANCO.svg \
         --output pedido_13387_COR01_BRANCO.tap \
         --tool whiteCutter \
         --quantity 30
```

**Implementação**:
1. Criar rota: POST `/api/orders/processar-com-sheetcam`
2. Enviar SVG + config para SheetCAM CLI
3. Receber .TAP real
4. Salvar em pasta

**Tempo**: 1-2 semanas
**Custo**: Depende de SheetCAM (licença)

---

### 3.2: Transparência de Logos

**Problema**: Logos com fundo branco precisam remover fundo  
**Solução**: ImageMagick ou Sharp.js

```bash
# Remover fundo branco:
convert logo.png -transparent white logo_clean.png

# Depois passa pro SheetCAM
```

**Implementação**:
1. Detectar `removeBackground: true` no config
2. Processar com ImageMagick antes de SVG
3. Passa logo limpo para SheetCAM

**Tempo**: 3-5 dias

---

### 3.3: PDF Prova com Assinatura

**Problema**: Cliente precisa assinar antes de pagar  
**Solução**: Puppeteer → PDF + PIN/Email assinatura

```typescript
// Gerar PDF
const browser = await puppeteer.launch()
const page = await browser.newPage()
await page.goto('http://localhost:3000/preview/pedido_13387')
const pdf = await page.pdf({ format: 'A4' })

// Salvar em:
// /var/www/files/pedidos/cliente_123/pedido_13387/PROVA.pdf
```

**Fluxo**:
```
1. Cliente clica "Gerar Prova"
2. Sistema cria PDF com design
3. Cliente vê: "Clique para APROVAR"
4. Entra PIN ou clica link email
5. Assinatura registrada
6. Libera pagamento
```

**Tempo**: 1 semana
**Custo**: 0 (Puppeteer free)

---

## Fase 4: Operacional (Setembro 2026)

### 4.1: Dashboard do Operador

```
URL: http://localhost:3000/operador/producao

INTERFACE:
┌─────────────────────────────────┐
│ PRODUÇÃO DO DIA (26/06/2026)    │
├─────────────────────────────────┤
│ [4 pedidos] [Tempo: 65 min]     │
│                                 │
│ ☐ PEDIDO #1234 | 30 un | 2 cores
│   COR1: BRANCO   [Não iniciado]
│   COR2: AZUL     [Não iniciado]
│   [► INICIAR]  [⏸ Pausar]
│                                 │
│ ✓ PEDIDO #1233 | 20 un | 2 cores
│   COR1: VERDE    [✓ Concluído]
│   COR2: DOURADO  [✓ Concluído]
│   [📦 Empacotar] [📞 Notificar]
└─────────────────────────────────┘
```

**Funcionalidades**:
- Lista de pedidos do dia
- Status por cor
- Botões: Iniciar, Pausar, Concluído
- Temporizador
- Histórico

**Tempo**: 2 semanas

---

### 4.2: Notificações (WhatsApp/Email)

**Triggers**:
1. "Novo pedido chegou!" (quando pago)
2. "Pronto para trocar cor em 5 min" (durante produção)
3. "Pedido concluído!" (para cliente)

**Integração**:
- Twilio (WhatsApp) ou MessageBird
- SendGrid (Email)
- Webhook do Dashboard

**Tempo**: 1 semana

---

### 4.3: Compartilhamento SMB (Mach3)

**Setup no servidor VPS**:
```bash
# /etc/samba/smb.conf
[tapetes]
  path = /var/www/files/tapetes
  browseable = yes
  valid users = operador
  create mask = 0755
```

**Setup no PC local (Windows)**:
```cmd
net use Z: \\VPS_IP\tapetes /user:operador SENHA /persistent:yes
```

**Resultado**:
```
Operador acessa:
Z:\2026\06\26\pedido_13387\pedido_13387_COR01_BRANCO.tap
                  ↑ Mach3 abre direto daqui
```

**Tempo**: 2-3 dias

---

## Fase 5: Marketplace (Outubro 2026)

### 5.1: Integração APIs

**Shopee**:
```
GET /api/shopee/pedidos?status=novo
POST /api/shopee/pedidos/{id}/processar
```

**MercadoLivre**:
```
GET /api/meli/pedidos?status=pago
POST /api/meli/pedidos/{id}/notificar
```

**Flow**:
```
Cliente compra no Marketplace
    ↓
Sistema puxa pedido (via API)
    ↓
Cria config padrão ou cliente configura
    ↓
Processa pagamento (automático)
    ↓
Gera .TAP
    ↓
Notifica operador
    ↓
Operador produz
    ↓
Sistema notifica Marketplace: "Pronto para envio"
    ↓
Gera etiqueta de envio
```

**Tempo**: 3 semanas

---

## Fases a Longo Prazo (2027)

### 6.1: Portal do Cliente
- Acompanhar produção em tempo real
- Download de prova + comprovante
- Histórico de pedidos

### 6.2: Analytics
- Dashboard de KPIs
- Tempo médio produção
- Taxa de retrabalho
- ROI por marketplace

### 6.3: Otimizações CNC
- Agrupamento automático de cores (batch)
- Gerador de toolpath próprio
- Simulação de corte antes de executar

---

## 💰 Estimativa de Investimento

| Fase | Tempo | Custo | Prioridade |
|------|-------|-------|-----------|
| **3.1: SheetCAM CLI** | 2 sem | $ (licença) | 🔴 CRÍTICA |
| **3.2: Transparência** | 1 sem | 0 | 🟡 ALTA |
| **3.3: PDF + Assinatura** | 1 sem | 0 | 🔴 CRÍTICA |
| **4.1: Dashboard Op** | 2 sem | 0 | 🟡 ALTA |
| **4.2: Notificações** | 1 sem | ~$50/mês | 🟡 ALTA |
| **4.3: SMB** | 3 dias | 0 | 🟢 MÉDIA |
| **5.1: Marketplace API** | 3 sem | 0 | 🟡 ALTA |

**Total investimento**: ~$200-500/mês (Twilio + SheetCAM)

---

## Roadmap Visual (Timeline)

```
JUNHO 2026
├─ v0.2: Simulador + .TAP mock ✅

JULHO 2026
├─ v0.3: Prova PDF + Assinatura

AGOSTO 2026
├─ v1.0: SheetCAM Real + Transparência
├─ Dashboard Operador
└─ Notificações WhatsApp

SETEMBRO 2026
├─ v1.1: SMB + Mach3 Direct
└─ Integração Shopee/MercadoLivre

OUTUBRO 2026
├─ v1.2: Go Live Marketplace
└─ Analytics

2027+
├─ Otimizações
├─ Mobile App
└─ Integrações adicionais
```

---

## ✅ Checklist: Antes de Vender

- [ ] SheetCAM CLI integrado (gera .TAP real)
- [ ] PDF Prova + assinatura funcional
- [ ] Pagamento (Stripe/MercadoPago)
- [ ] Dashboard operador básico
- [ ] Notificações WhatsApp
- [ ] SMB compartilhado com Mach3
- [ ] Testes E2E completos
- [ ] Documentação do operador
- [ ] Suporte técnico setup

---

## 🎯 Recomendação Imediata

**Para vender no Marketplace em Agosto 2026**:

1. **Esta semana**: Terminar PDF + Assinatura
2. **Próxima semana**: Integrar SheetCAM CLI real
3. **Semana 3**: Dashboard operador + notificações
4. **Semana 4**: Testes com 100 pedidos simulados

**Custo**: ~$200/mês (SheetCAM + Twilio)  
**Tempo**: 4 semanas  
**Risco**: Baixo (MVP já prova conceito)

---

## 💬 Dúvidas?

- **SheetCAM**: Qual versão vocês usam? (Studio? Pro?)
- **Marketplace**: Shopee ou MercadoLivre é prioridade?
- **Operador**: Acessa Mach3 em Windows ou Linux?
- **Telefone notificação**: Qual número WhatsApp?

Podemos agendar call para detalhar!

---

**Próximo commit**: Vamos começar pela integração de SheetCAM CLI?

