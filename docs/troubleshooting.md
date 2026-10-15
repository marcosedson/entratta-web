# Problemas conhecidos

Procure por assunto: `grep -n '^## \|^### ' docs/troubleshooting.md`

## Rotas
### Rota `/capacho-personalizado-[slug]` cai na home
**Sintoma:** página em `app/` com texto fixo + `[colchete]` no mesmo segmento (ex.: `capacho-personalizado-[slug]`) redireciona para `/` em vez de renderizar.
**Causa:** comportamento do App Router no Next 16 com segmento misto.
**Correção:** a página mora em segmento limpo (`app/rotas-internas/{cidade,segmento,combo}/[...]`) e `middleware.ts` reescreve a URL pública (sem mudar URL indexada). Rota nova desse tipo = nova regra no middleware; a ordem importa (`-em-` do combo antes do segmento).

### Finalizar pedido no `/monte-o-seu` dá 404
**Sintoma:** botão de finalizar ou de gerar `.tap` no configurador falha.
**Causa:** `app/monte-o-seu/Configurador.tsx:324` chama `/api/orders/finalizar-pedido` e `:610` chama `/api/orders/gerar-tap`, mas só existem `app/api/orders/{criar-pedido,gerar-layout-pdf}`; `OrderRepository.salvar()` não tem chamador.
**Correção:** pendente — criar as rotas (gravando com `OrderRepository.salvar`) ou apontar o configurador para as que existem.

## Dados e conteúdo
### Cidade aparece na lista mas a página dá 404
**Sintoma:** `/atendemos` ou os links listam uma cidade cuja página não existe.
**Causa:** havia cópias divergentes da lista de cidades (`lib/cities.ts`, `lib/data/cities.ts`) e as páginas vêm só de `lib/data.ts`.
**Correção:** cidade entra só em `lib/data.ts`; `lib/data/cities.ts` reexporta. O mesmo risco existe em segmentos: `lib/data/segments.ts` (usado por `lib/repositories/segment.repo.ts`) diverge de `lib/segments.ts` (usado pelas páginas).

### Post novo do blog não aparece
**Sintoma:** artigo adicionado não gera página nem entra no sitemap.
**Causa:** `import "@/lib/blog"` resolve `lib/blog.ts` (arquivo vence a pasta); `lib/blog/data.ts` é outra lista, usada só por `BlogService`.
**Correção:** adicione em `lib/blog.ts`. Formato do texto em [arquitetura](arquitetura.md#blog).

## Build e código
### Erro de build com evento em Server Component
**Sintoma:** `onClick`/`onMouseEnter` em componente sem `'use client'` quebra o build.
**Causa:** Server Component não serializa handler.
**Correção:** `'use client'` no componente, ou hover via classe CSS `:hover` em `app/globals.css`.

### `zod` some do `node_modules`
**Sintoma:** `lib/schemas/*` deixam de compilar após atualizar dependências.
**Causa:** `zod` não está em `package.json`; hoje vem só como dependência transitiva (`package-lock.json`).
**Correção:** pendente — declarar `zod` em `dependencies`.

### `services/production` cai com segfault
**Sintoma:** `pytest`/`uvicorn` do serviço de produção trava ao vetorizar.
**Causa:** `vtracer` segfaulta no Python 3.14.
**Correção:** venv com `python3.12` (`services/production/README.md`).

## Medição
### GA4 não registra eventos
**Sintoma:** nenhum evento em Real-time.
**Causa:** `NEXT_PUBLIC_GA_MEASUREMENT_ID` ausente no build (é `NEXT_PUBLIC_`, entra no bundle) ou ID inválido (tem de começar com `G-`); conversão leva até 24 h.
**Correção:** conferir a variável no Coolify/`.env.local` e refazer o build; validar em Real-time → Events. Mais em [analytics/setup.md](analytics/setup.md#-troubleshooting).
