# Arquitetura

## Stack
Next.js 16.2 (App Router) · React 19.2 · TypeScript strict · Tailwind v4 (CSS-nativo) · GSAP + Lenis · sharp/potrace/jspdf no servidor. Versões em `package.json`; antes de usar API nova do Next, consulte `node_modules/next/dist/docs/`.
Serviço de produção à parte em Python/FastAPI (`services/production/`, [README](../services/production/README.md)).

## Rotas
- Páginas estáticas em `app/<rota>/page.tsx` (`/monte-o-seu`, `/medidas`, `/capacho-liso`, `/melhor-preco`, `/como-funciona`, `/depoimentos`, `/arquitetos`, `/atendemos`, `/lojas`, `/contato`, `/blog`).
- Páginas de SEO local: a URL pública `/capacho-personalizado-<cidade>`, `/capacho-para-<segmento>` e `/capacho-para-<segmento>-em-<cidade>` é reescrita por `middleware.ts` para `app/rotas-internas/{cidade,segmento,combo}/**`. Motivo em [troubleshooting](troubleshooting.md#rota-capacho-personalizado-slug-cai-na-home).
- Páginas dinâmicas usam `generateStaticParams()` + `dynamicParams = true`; metadata por `generateMetadata()` (dinâmica) ou `export const metadata` (estática).
- `next.config.ts`: `www.` → apex e http → https (redirect 301).
- API: sempre `app/api/<recurso>/<ação>/route.ts`.

## Dados (fonte única)
| Dado | Arquivo | Usado por |
|---|---|---|
| Cidades | `lib/data.ts` (`CITIES_DATA`) | páginas de cidade, `/atendemos`, sitemap, `lib/geo.ts`; `lib/data/cities.ts` só reexporta |
| Segmentos | `lib/segments.ts` (`SEGMENTS_DATA`) | páginas de segmento, combos, sitemap |
| Combos cidade×segmento | `lib/city-segment.ts` | páginas combo (só as cidades de `TOP_CITIES`) |
| Blog | `lib/blog.ts` | `/blog`, `/blog/[slug]`, sitemap |
| Config do pedido | `data/config.json` | prazo (dias úteis), cores disponíveis, aviso |

`import "@/lib/data"`/`"@/lib/blog"` resolve o **arquivo** `.ts`, não a pasta. `lib/data/segments.ts` e `lib/blog/data.ts` são cópias divergentes usadas só por `lib/repositories/segment.repo.ts` e `lib/services/blog.service.ts` (pendente unificar).

## Camadas
Código novo segue as camadas de `lib/` (detalhe e exemplo em [historico/plano-refatoracao-solid.md](historico/plano-refatoracao-solid.md)):

| Pasta | O que vai lá |
|---|---|
| `lib/types/` | interfaces TS (antes de usar, declare aqui) |
| `lib/constants/` | valores fixos: cores, medidas, bordas, fontes, navegação/WhatsApp, paleta ACI, estoque de vinil |
| `lib/schemas/` | validação Zod na borda (`z.infer` para o tipo) |
| `lib/repositories/` | acesso a dados (`order.repo.ts` grava em `PEDIDOS_DIR/{ano}/{mes}/{orderId}/`) |
| `lib/services/` | regra de negócio sem estado: preço, SEO, PDF, produção, WhatsApp (Evolution), e-mail, auth do admin |
| `lib/hooks/` | estado/efeitos React reutilizáveis (`useConfigurator`, `useHeroAnimation`, `usePDFExport`, `useSizeQuote`) |

Limites: componente ≤ 200 linhas (componha), utilitário ≤ 300; dado separado de lógica; `index.ts` reexporta. Hoje passam do limite `components/Configurator.tsx` (sem import, legado do configurador antigo), `components/ProductLines.tsx` e `app/blog/[slug]/page.tsx`.

## Componentes e animação
- Server Component por padrão; `'use client'` para hooks, eventos, refs e APIs do navegador. Hover em server component = classe CSS com `:hover` em `globals.css`.
- `next/image` para conteúdo (nada de `<img>`).
- Lenis global via `components/SmoothScrollProvider.tsx` em `app/layout.tsx`, ligado ao ScrollTrigger (`lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker`).
- GSAP: `registerPlugin(ScrollTrigger)` por componente, `gsap.context()` + `ctx.revert()` no cleanup, ease `power3.out`/`expo.out` ≥ 0,6 s. Pin no desktop (`pin:true, scrub:0.9, anticipatePin:1`); no celular `gsap.matchMedia()` sem pin, reveal simples `start:'top 82%'`.
- Tokens de cor/fonte em `app/globals.css` (`@theme inline`); lista resumida em `AGENTS.md`.

## Blog
Conteúdo em texto puro (sem markdown), lido por `ArticleContent` em `app/blog/[slug]/page.tsx`:
- `═══ TÍTULO ═══` separador principal; `─── Seção ───` separador de seção;
- linha toda em MAIÚSCULAS = subtítulo; prefixos `PASSO`, `ERRO`, `RAZÃO`, `VANTAGEM`, `FATOR`, `EXEMPLO`, `OPÇÃO` = destaque;
- listas `→`, `-`, `✓`, `1.`; tabela = linhas começando com `|`.
Um H1 por artigo (o título); o corpo não deve repetir H1.

## Pedido → produção
- `/monte-o-seu` (`app/monte-o-seu/Configurador.tsx`) chama `/api/producao/{preview,vetorizar}`, `/api/orders/criar-pedido` (PDF de layout + aviso por WhatsApp via `lib/services/whatsapp.service.ts`) e também `/api/orders/finalizar-pedido` e `/api/orders/gerar-tap` — **essas duas rotas não existem neste branch** (ver [troubleshooting](troubleshooting.md#finalizar-pedido-no-monte-o-seu-dá-404)).
- `/api/producao/*` repassa ao serviço Python (`lib/services/producao.service.ts`, `PRODUCTION_SERVICE_URL`, header `x-production-key` = `PRODUCTION_API_KEY`).
- Pedido salvo = `OrderRepository.salvar()` (`lib/repositories/order.repo.ts`) em `PEDIDOS_DIR/{ano}/{mes}/{orderId}/{pedido.json, preview.png, producao.zip}`; o admin lê de lá (`app/api/admin/pedidos/`). O operador pega o `.zip` (um `.tap` por cor) na pasta Samba (`scripts/setup-samba.sh`).
- Estudos de automação (Mach3, vetorização, logo) em [estudos/](estudos/).
