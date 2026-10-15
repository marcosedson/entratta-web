# Google Analytics Setup — Entratta

## ✅ Implementação Completa

Google Analytics 4 está 100% integrado no site. Todos os eventos estão sendo rastreados automaticamente.

---

## 📊 Eventos Rastreados Automaticamente

### WhatsApp Interactions
- **Header desktop**: `trackWhatsAppClick('header_desktop')`
- **Header mobile**: `trackWhatsAppClick('header_mobile')`
- **Hero primary**: `trackWhatsAppClick('hero_cta')`
- **Hero secondary**: `trackWhatsAppClick('hero_secondary')`
- **Floating button**: `trackWhatsAppClick('floating_button')`
- **CTA Final**: `trackWhatsAppClick('cta_final_verify_price')` + `trackWhatsAppClick('cta_final_specialist')`
- **Blog articles**: `trackWhatsAppClick('blog_[slug]')`

### Conversions
- **Order completed**: `trackOrderCompleted(orderId, medida)` — CONVERSÃO!
- **Configurador config**: `trackConfiguradorConfig(medida, corTapete)`
- **Article read**: `trackArticleRead(slug, title)`
- **Product click**: `trackCTAClick('product', 'hero_mercado_livre')`

### Leads
- Cada WhatsApp click registra: `trackLeadGenerated(source, 'whatsapp')`

---

## 🎯 Configurar Goals no Google Analytics

Goals transformam eventos em conversões mensuráveis. Configure esses 3 Goals:

### Goal 1: WhatsApp Lead
1. Abra: https://analytics.google.com
2. **Admin** > **Conversions** (à esquerda) > **Create new conversion goal**
3. Nome: `WhatsApp_Lead`
4. Descrição: "Usuário clicou em WhatsApp"
5. **Event name**: `click_whatsapp`
6. Salve

### Goal 2: Order Completed (Conversão Principal)
1. **Admin** > **Create new conversion goal**
2. Nome: `Order_Completed`
3. Descrição: "Pedido criado no configurador"
4. **Event name**: `order_completed`
5. Salve ← **ESSA É SUA CONVERSÃO PRINCIPAL**

### Goal 3: Blog Engagement
1. **Admin** > **Create new conversion goal**
2. Nome: `Blog_Article_Read`
3. Descrição: "Usuário leu artigo do blog"
4. **Event name**: `read_article`
5. Salve

---

## 📈 Dashboard Recomendado

Adicione esses cards ao seu **Dashboard do GA**:

### Card 1: Traffic by UTM Source
1. Relatórios > **User acquisition** > **Traffic acquisition**
2. Dimension: `Session source`
3. Metric: `Sessions`, `Users`, `Conversions`
4. Filter: `Session utm_source (is not empty)`

### Card 2: WhatsApp Leads This Week
1. Relatórios > **Real-time events**
2. Event name: `click_whatsapp`
3. Veja em tempo real quem está clicando

### Card 3: Order Conversion Rate
1. Relatórios > **Conversions**
2. Goal: `Order_Completed`
3. Veja quantos usuários converteram

---

## 🔍 Como Testar (DevTools)

### Teste 1: Verificar GA está carregando
1. Abra https://entratta.com.br
2. DevTools (F12) > **Network**
3. Procure por: `googletagmanager.com`
4. Deve aparecer requests com seu ID: `G-ZKMH4JWYYG`

### Teste 2: Verificar evento de WhatsApp
1. Clique em qualquer botão WhatsApp
2. DevTools > **Network** > procure por `collect` endpoint
3. Deve enviar payload com `event_name: click_whatsapp`

### Teste 3: Verificar em Real-Time
1. GA > **Reports** > **Real-time** > **Events**
2. Clique em botão WhatsApp
3. Aparece como `click_whatsapp` em tempo real

---

## 📲 Testar com UTM Parameters

### Simular tráfego do Instagram
```
https://entratta.com.br/?utm_source=instagram&utm_medium=story&utm_content=link_in_bio&utm_campaign=may_2026
```

### Simular tráfego do Facebook Ads
```
https://entratta.com.br/?utm_source=facebook&utm_medium=cpc&utm_content=ad_carousel&utm_campaign=conversao_q2
```

**Resultado**: Em 1-2 minutos, aparece em **User acquisition** com breakdown por `utm_source`.

---

## 📊 Métricas Principais para Monitorar

### Diariamente
- **Sessions** — Quantas visitas por dia?
- **Users** — Quantos usuários únicos?
- **Click_whatsapp events** — Quantos cliques em WhatsApp?
- **Order_completed conversions** — Quantos pedidos criados?

### Semanalmente
- **Conversion rate**: `Orders / Sessions × 100`
- **Lead cost**: `Ads spend / Click_whatsapp count`
- **Top traffic sources**: De onde vem mais tráfego?
- **Top pages**: Qual página converte mais?

### Mensalmente
- **Traffic trends**: Crescimento mês a mês?
- **Campaign performance**: Qual fonte traz melhor ROI?
- **Device breakdown**: Mobile vs Desktop — quem converte mais?
- **Geographic data**: De qual cidade vem mais tráfego?

---

## 🎨 Funnels (Opcional)

Para rastrear a jornada completa:

1. **GA** > **Analysis** > **Create new analysis**
2. **Exploration type**: `Funnel exploration`
3. **Funnel steps**:
   - Step 1: `page_view` (página inicial)
   - Step 2: `click_cta` (clicou em CTA)
   - Step 3: `click_whatsapp` (clicou em WhatsApp)
   - (opcional) Step 4: `order_completed` (criou pedido)

Isso mostra o **drop-off** em cada etapa.

---

## 🚨 Troubleshooting

### GA não está rastreando
- ✓ Verificar se `NEXT_PUBLIC_GA_MEASUREMENT_ID` está em `.env.local`
- ✓ Verificar se GA ID é válido (começa com `G-`)
- ✓ Limpar cache do navegador (Ctrl+Shift+Delete)
- ✓ Verificar se cookies estão habilitados

### Eventos aparecem no DevTools mas não no GA
- Espere 24h — GA pode levar tempo para processar dados novo
- ✓ Verificar em **Real-time** > **Events** primeiro (atualiza em segundos)

### Conversão não está aparecendo
- ✓ Verificar se Goal foi criado corretamente
- ✓ Verificar se `Event name` no Goal bate exatamente com evento enviado
- ✓ Esperar 24h — GA processa conversões em lote

---

## 📞 Contato & Suporte

Se tiver dúvidas sobre configuração do GA:
- Docs oficial: https://support.google.com/analytics
- Chat Google: https://support.google.com/analytics/answer/1008015
