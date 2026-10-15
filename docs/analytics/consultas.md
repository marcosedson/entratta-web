# Google Analytics Queries — Custom Reports

Use essas consultas para criar relatórios customizados no GA.

---

## 📊 Query 1: WhatsApp Clicks by Source

**O que mede**: De onde vem a maioria dos cliques em WhatsApp?

### No GA (Reports > Exploration > Free form)
- **Dimensions**: `Session source`, `Event name`
- **Metrics**: `Event count`
- **Filters**: `Event name = click_whatsapp`

**Esperado**: Tabela mostrando:
```
Session source         | Event count
instagram              | 342
google                 | 156
direct                 | 89
facebook               | 45
```

---

## 📊 Query 2: Conversion Funnel (Landing → Order)

**O que mede**: Qual é o funil de conversão?

### No GA (Reports > Exploration > Funnel exploration)
**Steps**:
1. `page_view` (first page = home)
2. `click_cta` (any CTA click)
3. `click_whatsapp` (WhatsApp click)
4. `order_completed` (order created)

**Esperado**: Gráfico tipo:
```
100% (users) → Página inicial
 ↓
42% (42 users) → Clicaram em CTA
 ↓
38% (38 users) → Clicaram em WhatsApp
 ↓
12% (12 users) → Criaram pedido
```

---

## 📊 Query 3: Top Pages by WhatsApp Clicks

**O que mede**: Qual página gera mais cliques em WhatsApp?

### No GA (Reports > Exploration > Free form)
- **Dimensions**: `Page path and query string`, `Event name`
- **Metrics**: `Event count`
- **Filter**: `Event name = click_whatsapp`
- **Sort by**: `Event count` (descending)

**Esperado**:
```
Page                           | click_whatsapp count
/                              | 156 (homepage)
/blog/quanto-custa-tapete      | 42 (blog article)
/capacho-para-clinica          | 28 (segment page)
/capacho-personalizado-saopaulo| 19 (city page)
```

---

## 📊 Query 4: Mobile vs Desktop Conversion

**O que mede**: Qual dispositivo converte mais?

### No GA (Reports > Exploration > Free form)
- **Dimensions**: `Device category`
- **Metrics**: `Sessions`, `Conversions` (Goal: Order_Completed)
- **Sort**: `Conversions desc`

**Esperado**:
```
Device      | Sessions | Conversions | Conv. Rate
Mobile      | 1,245    | 42          | 3.4%
Desktop     | 856      | 31          | 3.6%
Tablet      | 123      | 2           | 1.6%
```

---

## 📊 Query 5: UTM Campaign Performance

**O que mede**: Qual campanha de UTM tem melhor ROI?

### No GA (Reports > Acquisition > Campaigns)
- View padrão mostra: `Campaign`, `Users`, `Conversions`

**Esperado**:
```
Campaign           | Users | Conversions | Conv. Rate
may_2026           | 342   | 18          | 5.3%
instagram_reels    | 156   | 8           | 5.1%
fb_ads_carousel    | 124   | 4           | 3.2%
google_search      | 89    | 3           | 3.4%
```

---

## 📊 Query 6: Blog Article Performance

**O que mede**: Qual artigo gera mais leads?

### No GA (Reports > Exploration > Free form)
- **Dimensions**: `Event parameter: article_slug`
- **Metrics**: `Event count` (Event: read_article), `Event count` (Event: click_whatsapp)

**Esperado**:
```
article_slug                              | Reads | WhatsApp Clicks | Conv. %
quanto-custa-capacho-personalizado        | 342   | 48              | 14%
capacho-personalizado-para-clinica        | 156   | 21              | 13%
tapete-vinil-personalizado-empresa        | 124   | 14              | 11%
```

---

## 📊 Query 7: Real-Time Monitoring

**O que mede**: O que está acontecendo AGORA no site?

### No GA (Reports > Real-time > Events)
Vê em tempo real:
- Quantos usuários estão no site agora
- Qual página estão visitando
- Que eventos estão acontecendo

**Esperado** (atualizado a cada ~5 segundos):
```
Event           | Count (last 30 min)
page_view       | 23
click_whatsapp  | 7
click_cta       | 12
read_article    | 5
```

---

## 🔧 Como Usar Essas Queries

### Opção 1: Manual no GA (Recomendado)
1. Abra https://analytics.google.com
2. Seu projeto > **Reports** (esquerda)
3. **Explorations** (novo relatório)
4. Selecione tipo: `Free form`, `Funnel`, etc
5. Configure dimensions e metrics conforme acima
6. Salve para reutilizar

### Opção 2: Google Analytics 4 Python Client (Avançado)
Se quiser automatizar relatórios:

```python
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import RunReportRequest

# Setup (requer credenciais de serviço)
client = BetaAnalyticsDataClient()
request = RunReportRequest(
    property=f"properties/{PROPERTY_ID}",
    dimensions=[{"name": "date"}, {"name": "sessionSource"}],
    metrics=[{"name": "activeUsers"}, {"name": "conversions"}],
)

response = client.run_report(request)
# Processar dados...
```

---

## 📈 Dashboard Recomendado (Quick Start)

Crie um dashboard com esses cards:

### Card 1: KPI — Conversões de Hoje
- Métrica: `Conversions` (Goal: Order_Completed)
- Período: Últimos 7 dias
- Target: 3+ pedidos/dia

### Card 2: Gráfico — WhatsApp Trends
- Métrica: `Event count` (Event: click_whatsapp)
- Período: Últimos 30 dias
- Tipo: Line chart (tendência)

### Card 3: Tabela — Top Pages
- Dimensão: `Page path`
- Métrica: `Users`, `Conversions`
- Top 10 páginas

### Card 4: Gráfico — Fonte de Tráfego
- Dimensão: `Session source`
- Métrica: `Sessions`
- Tipo: Pie chart

---

## 🎯 Metas Recomendadas

Para um e-commerce de capachos:

| Métrica | Meta | Frequência |
|---------|------|-----------|
| Click-through rate (CTR) | 5-10% | Diário |
| WhatsApp conversion rate | 3-5% | Semanal |
| Order rate | 10-20% de leads | Semanal |
| Average session duration | 2+ min | Semanal |
| Bounce rate | < 40% | Semanal |

---

## 💡 Tips & Tricks

### ✓ Use Segments
Crie segmentos para análises específicas:
- "Usuários que clicaram em WhatsApp"
- "Visitantes que vieram do Instagram"
- "Usuários que leram blog + clicaram CTA"

### ✓ Alertas Automáticos
Configure alertas para:
- "Conversão cair abaixo de 2 por dia"
- "Bounce rate subir acima de 50%"
- "Tráfego cair 30% vs semana anterior"

### ✓ Annotations
Marque eventos importantes no GA:
- "Lancei campanha do Instagram"
- "Mudei CTA do hero"
- "Adicionei novo artigo no blog"

---

## 📞 Documentação

Docs completa do GA4:
https://support.google.com/analytics/answer/9304153
