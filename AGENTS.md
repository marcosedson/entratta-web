<!-- ENTRATTA-WEB AGENT CONTEXT — otimizado para parsers LLM -->

## Stack

| | Versão | Crítico |
|---|---|---|
| Next.js | 16.2.9 | App Router — leia `node_modules/next/dist/docs/` antes de escrever código |
| React | 19.2.4 | `use()`, Actions, cache — diferem do React 18 |
| TypeScript | ^5 | strict |
| Tailwind | v4 | CSS-nativo — ✗ `tailwind.config.js` |
| GSAP | latest | ScrollTrigger registrado por componente; `gsap.context()` + `ctx.revert()` no cleanup |
| Lenis | latest | scroll suave global via `SmoothScrollProvider` em `layout.tsx`; remove `scroll-behavior:smooth` do CSS |

## Regras de animação (lei de ouro)

- Scroll suave → **Lenis** (não CSS `scroll-behavior`)
- Movimento de elementos → **GSAP** (não CSS `transition`/`animation` para efeitos de entrada)
- Ease padrão → `power3.out` ou `expo.out` — ✗ ease abaixo de `0.6s`
- Pin scroll desktop → `ScrollTrigger { pin:true, scrub:0.9, anticipatePin:1 }`
- Mobile → `gsap.matchMedia()` — desabilitar pin, usar reveal simples `start:'top 82%'`
- Lenis + ScrollTrigger → conectar via `lenis.on('scroll', ScrollTrigger.update)` e `gsap.ticker.add(raf)`

## Mapa de arquivos

```
app/
  layout.tsx              ← fontes globais + metadata
  globals.css             ← @theme inline (todos os tokens)
  page.tsx                ← homepage
  configurador/           ← SVG interativo ('use client', ssr:false)
  como-funciona/ lojas/ depoimentos/ resultado-simulacao/ simulator/
  api/orders/
    gerar-tap/route.ts    ← POST: design → .TAP (CNC)
    gerar-batches/route.ts← POST: pedido+qtd → batches por cor

components/               ← Server por padrão; exceções abaixo:
  Header.tsx FAQ.tsx FloatingWhatsApp.tsx Configurator.tsx  ← 'use client'
  SmoothScrollProvider.tsx Hero.tsx ProblemSolution.tsx Testimonials.tsx  ← 'use client' (GSAP)

lib/
  svg-generator.ts        ← SVG por camada/cor
  tap-converter.ts        ← SVG → G-code mock
  batch-processor.ts      ← agrupa por cor
```

## Regras de componente

- ✗ event handlers em Server Components → erro de build
- hover em server component → classe CSS em `globals.css` com `:hover`
- ✓ `'use client'` para: hooks, event handlers, refs, browser APIs
- ✓ `next/image` em ambos — ✗ `<img>` para conteúdo
- browser libs → `dynamic(() => import(...), { ssr: false })` em client component pai

## Tokens (globals.css `@theme inline`)

```
brand:#4ADE80  brand-solid:#22C55E  brand-dark:#15803D
dark:#0A1628   dark-2:#0F1F38       dark-3:#111D30
navy:#1E3A5F   slate:#94A3B8
font-sans:Plus Jakarta Sans  font-heading:Cormorant Garamond  font-accent:Syne
logo:/public/logo.png  whatsapp:5564992066855
```

## Negócio

| | |
|---|---|
| Produto | Capachos/tapetes vinil personalizados por CNC |
| Preço | R$ 300/m² · mínimo R$ 72 (40×60cm) · até 12x |
| Públicos | B2B: clínicas, escritórios, lojas · B2C: presentes, residências |
| Canais | Site (configurador→WhatsApp) · Shopee · ML (links `#` → preencher) |
| Estado | v0.2: configurador+TAP prontos · ✗ pagamento, dashboard, SheetCAM real |
