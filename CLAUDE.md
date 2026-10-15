# entratta-web — site da Entratta (capachos de vinil personalizados por CNC): SEO local, configurador, pedidos e admin (Next.js 16)
Site + rotas `app/api/*` no mesmo app. Pedidos viram arquivos em `PEDIDOS_DIR` (Samba com a produção); prévia/G-code vêm do microserviço Python `services/production` (`PRODUCTION_SERVICE_URL`).
Lead e venda fecham no WhatsApp; integra Mercado Livre/Shopee e avisos pela Evolution API.

## Comandos
```bash
npm ci                     # instalar (Dockerfile usa npm + package-lock; ignore o yarn.lock)
npm run dev                # http://localhost:3000
npm run lint               # eslint
npx tsc --noEmit           # typecheck (não há script)
npm run build              # next build (valida todas as rotas)
# não há testes JS. Serviço de produção (Python 3.12 — vtracer segfaulta no 3.14):
cd services/production && python3.12 -m venv .venv && .venv/bin/pip install -r requirements-dev.txt
.venv/bin/pytest                                   # tudo; um só: .venv/bin/pytest tests/test_spiral.py
.venv/bin/uvicorn app.main:app --port 8000
```

## Regras que não se quebram
- **Push em `main` publica em produção** (`.github/workflows/deploy.yml` → Coolify → entratta.com.br, porta 3002). Confira o branch antes.
- Rota com texto fixo + `[param]` no mesmo segmento quebra no Next 16: página mora em `app/rotas-internas/**` e `middleware.ts` reescreve a URL pública. Ver [troubleshooting](docs/troubleshooting.md#rota-capacho-personalizado-slug-cai-na-home).
- Fonte única dos dados: cidades `lib/data.ts`, segmentos `lib/segments.ts`, blog `lib/blog.ts`. Cidade/segmento/post novo entra só aí (gera página + sitemap).
- Sem preço no site: posicionamento "fabricante direto, sem intermediário" (sem "mais barato"); orçamento pelo WhatsApp (`WPP_URL` em `lib/constants/navigation.ts`). Ver [negócio](docs/negocio.md).
- Animação: scroll suave = Lenis, movimento = GSAP (`gsap.context()` + `ctx.revert()`, ease ≥ 0,6 s, `matchMedia` no celular); nada de CSS `transition`/`scroll-behavior` para isso.
- Server Component não tem event handler; `'use client'` só onde há hook/evento/ref/API do navegador; lib de navegador via `dynamic(..., { ssr: false })`.
- Tailwind v4 sem `tailwind.config.js`: tokens em `app/globals.css` (`@theme inline`); cor/medida/fonte vêm de `lib/constants/`, nunca fixas no componente.
- Paleta ACI e formato do G-code são da produção — não mudar (`services/production/app/palette.py`, [README do serviço](services/production/README.md)).
- Sem segredos no repo (só nomes de variáveis — lista em [operação](docs/operacao.md#variáveis)). Commits: `feat:`/`fix:`/`refactor:`, um assunto por commit.

## Onde está cada coisa
| Caminho | Responsabilidade |
|---|---|
| `app/layout.tsx`, `app/globals.css` | fontes, metadata, schema `LocalBusiness`/`Offer`, tokens |
| `app/rotas-internas/{cidade,segmento,combo}` + `middleware.ts` | páginas `/capacho-personalizado-*`, `/capacho-para-*`, `/capacho-para-*-em-*` |
| `app/monte-o-seu/` | configurador atual (SVG interativo, logos, textos, prévia) |
| `app/blog/[slug]/page.tsx` | artigo + `ArticleContent` (parser do formato texto do blog) |
| `app/sitemap.ts`, `app/robots.ts`, `app/api/og` | SEO técnico e imagem OG |
| `app/admin/`, `app/api/admin/` | painel interno (pedidos, integrações), header `x-admin-password` |
| `app/api/orders/`, `app/api/producao/` | criar pedido / PDF; proxy para o serviço de produção (`x-production-key`) |
| `app/api/{auth,webhooks}/{ml,shopee}` | OAuth e webhooks Mercado Livre / Shopee |
| `lib/data.ts`, `lib/segments.ts`, `lib/city-segment.ts`, `lib/blog.ts` | dados que geram as páginas |
| `lib/{types,constants,schemas,repositories,services,hooks}/` | camadas (ver [arquitetura](docs/arquitetura.md#camadas)) |
| `lib/analytics.ts`, `components/GoogleAnalytics.tsx` | eventos GA4 |
| `services/production/` | FastAPI: `/preview`, `/generate` (.tap Mach3), `/vectorize` |
| `scripts/setup-samba.sh` | pasta de pedidos compartilhada na VPS |
| `AGENTS.md` | stack, tokens de cor, contexto de negócio (resumo para agentes) |

## Docs
- Índice: [docs/README.md](docs/README.md)
- Arquitetura: [docs/arquitetura.md](docs/arquitetura.md)
- Negócio/SEO: [docs/negocio.md](docs/negocio.md)
- Operação, deploy e variáveis: [docs/operacao.md](docs/operacao.md)
- Problemas conhecidos: [docs/troubleshooting.md](docs/troubleshooting.md)

## Armadilhas mais comuns
- `/capacho-personalizado-x` abre a home → [rota mista no Next 16](docs/troubleshooting.md#rota-capacho-personalizado-slug-cai-na-home).
- Cidade listada mas página 404 → [cópia divergente dos dados](docs/troubleshooting.md#cidade-aparece-na-lista-mas-a-página-dá-404).
- Post novo não aparece → [`@/lib/blog` é `lib/blog.ts`, não `lib/blog/`](docs/troubleshooting.md#post-novo-do-blog-não-aparece).
- Artigo sem espaçamento/listas → [formato texto do blog](docs/arquitetura.md#blog).
- GA sem eventos → [GA4](docs/troubleshooting.md#ga4-não-registra-eventos).
