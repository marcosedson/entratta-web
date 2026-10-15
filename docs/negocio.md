# Negócio e regras

Procure por assunto: `grep -n '^## \|^### ' docs/negocio.md`

## Produto
### Capacho de vinil personalizado pintado por CNC
**Regra:** produto = capachos/tapetes de vinil personalizados (logo, texto, cor); medidas do catálogo (`lib/constants/measurements.ts`, `size-guide.ts`) e cores do estoque (`lib/constants/vinyl-inventory.ts`, `data/config.json`).
**Porquê:** a máquina e o estoque físico definem o que dá para fazer; o site não promete o que a produção não tem.
**Onde:** `app/monte-o-seu/`, `app/medidas/`, `app/capacho-liso/`.

### Paleta ACI e G-code são da produção
**Regra:** códigos ACI (9, 230, 166, 30, 114) e o formato do `.tap` (Mach3, pitch 1,4 mm, Z nunca negativo) não mudam.
**Porquê:** são o padrão da empresa e foram validados contra `.tap` reais; o que o cliente aprova na prévia sai dos mesmos polígonos que a máquina pinta.
**Onde:** `services/production/app/palette.py`, `lib/constants/aci-palette.ts`, [README do serviço](../services/production/README.md).

### Antes de rodar produção real
**Regra:** `pytest` → conferir o `.tap` num simulador (NC Viewer/CAMotics) → passada de teste com manta de descarte. X0,Y0 = batente físico da mesa.
**Porquê:** o G-code não tem campo de tamanho; manta fora da referência sai deslocada.
**Onde:** `services/production/README.md`.

## Preço e venda
### Sem preço no site; orçamento pelo WhatsApp
**Regra:** nenhuma página mostra preço; CTA leva ao WhatsApp (`WPP_URL`, `lib/constants/navigation.ts`). `/melhor-preco` posiciona sem números (schema `Offer` sem preço visível).
**Porquê:** mantém preço flexível entre canais (site, Mercado Livre, Shopee) e captura o lead.
**Onde:** `app/melhor-preco/page.tsx`, `components/TrackedWhatsAppLink.tsx`, `components/FloatingWhatsApp.tsx`.

### "Fabricante direto, sem intermediário" — nunca "o mais barato"
**Regra:** o argumento é verificável (direto da fábrica); não usar superlativo de menor preço nem nota/avaliação autodeclarada no schema.
**Porquê:** claim não verificável e review autodeclarado prejudicam SEO e confiança.
**Onde:** `components/FAQSchema.tsx` (1ª pergunta: "Por que comprar direto da Entratta?"), `app/layout.tsx`.

### Públicos e canais
**Regra:** B2B (clínicas, escritórios, lojas, arquitetos — `/arquitetos`) e B2C (residência, presente). Canais: site → WhatsApp, Mercado Livre e Shopee (`app/api/{auth,webhooks}/{ml,shopee}`, `lib/ml-api.ts`, `lib/shopee-api.ts`).
**Porquê:** o site é vitrine e captação; a venda fecha no atendimento ou no marketplace.
**Onde:** `components/Marketplace.tsx`, `app/lojas/`.

## SEO
### Páginas locais por cidade, segmento e combinação
**Regra:** cada cidade de `lib/data.ts` e segmento de `lib/segments.ts` gera página; combos cidade×segmento só para as cidades de `TOP_CITIES` (`lib/city-segment.ts`), com links internos entre elas.
**Porquê:** long-tail local sem gerar página sem sentido (combo de cidade pequena vira conteúdo raso).
**Onde:** `app/rotas-internas/**`, `components/{CitiesLinks,CityLocalLinks,SegmentCityLinks}.tsx`.

### Schema e metadados
**Regra:** `LocalBusiness`+`ManufacturingBusiness` em `app/layout.tsx` (priceRange `$`); `BlogPosting`+`BreadcrumbList` no artigo; `FAQPage` em `components/FAQSchema.tsx`; todas as páginas com Open Graph (`app/opengraph-image.tsx`, `app/api/og`) e Twitter `summary_large_image`. Um H1 por página, com a palavra-chave.
**Porquê:** rich results e CTR; H1 duplicado e endereço inconsistente já foram corrigidos.
**Onde:** `app/layout.tsx`, `app/blog/[slug]/page.tsx`.

### Sitemap e robots
**Regra:** `app/sitemap.ts` inclui cidades, segmentos, combos, blog e páginas fixas (com prioridade); `app/robots.ts` indexa tudo. Página nova fixa → adicionar no sitemap; depois de mudança grande, reenviar no Search Console.
**Porquê:** página fora do sitemap demora a indexar.
**Onde:** `app/sitemap.ts`.

## Medição
### Eventos GA4 de lead e pedido
**Regra:** clique em WhatsApp, CTA, visita/configuração do configurador, pedido e leitura de artigo viram eventos GA4 (`ANALYTICS_EVENTS` em `lib/analytics.ts`); ID em `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
**Porquê:** o lead fecha fora do site; o clique no WhatsApp é a conversão medível.
**Onde:** `lib/analytics.ts`, `components/GoogleAnalytics.tsx`, guias em [analytics/](analytics/).
