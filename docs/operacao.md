# Operação

## Deploy
- Push em `main` → `.github/workflows/deploy.yml` chama o deploy do Coolify (secret `COOLIFY_TOKEN`) → https://entratta.com.br. Não há CI de lint/build antes: rode `npm run build` local antes de subir.
- Imagem: `Dockerfile` (node:20-alpine, `npm ci` com `package-lock.json`, `npm run build`, `npm start` na porta **3002**). `docker-compose.yml` sobe o mesmo na 3002 para teste local da imagem.
- `next.config.ts` força apex + https; atrás de proxy depende do header `x-forwarded-proto`.
- O serviço Python `services/production` tem `Dockerfile` próprio (porta 8000) e não é publicado por este workflow — onde roda em produção está a confirmar.

## Variáveis
Só nomes (valores no Coolify / `.env.local`, que é ignorado pelo git; modelo em `.env.example`).

| Variável | Para quê | Onde |
|---|---|---|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 (entra no bundle no build) | `components/GoogleAnalytics.tsx` |
| `NEXT_PUBLIC_BASE_URL` | URL de retorno do OAuth | `app/api/auth/{ml,shopee}` |
| `ADMIN_PASSWORD` | senha do painel `/admin` (header `x-admin-password`) | `lib/services/admin-auth.ts` |
| `PEDIDOS_DIR` | pasta dos pedidos (padrão `./pedidos`; na VPS `/var/entratta/pedidos`, compartilhada por Samba) | `lib/repositories/order.repo.ts` |
| `PRODUCTION_SERVICE_URL`, `PRODUCTION_API_KEY` | serviço de produção (padrão `http://localhost:8000`) e chave das rotas `/api/producao/*` | `lib/services/producao.service.ts`, `app/api/producao/` |
| `EVOLUTION_API_URL`, `EVOLUTION_API_KEY`, `EVOLUTION_INSTANCE`, `EVOLUTION_GROUP_JID` | aviso de pedido por WhatsApp | `lib/services/whatsapp.service.ts`, `lib/notifications.ts` |
| `ML_APP_ID`, `ML_CLIENT_SECRET` | Mercado Livre (OAuth/webhook) | `lib/ml-api.ts`, `app/api/auth/ml` |
| `SHOPEE_PARTNER_ID`, `SHOPEE_PARTNER_KEY` | Shopee | `lib/shopee-api.ts`, `app/api/auth/shopee` |

## Pasta de pedidos (Samba)
`scripts/setup-samba.sh` (rodar como root na VPS) compartilha `/var/entratta/pedidos` na rede para o operador da CNC abrir `preview.png` e `producao.zip`. O container precisa montar essa pasta e ter `PEDIDOS_DIR` apontando para ela.

## Verificar no navegador
Chrome/Firefox em `localhost:3000`, celular/tablet/desktop; animação GSAP sem tranco; link do WhatsApp testado no celular; em mudança de blog, conferir separadores e espaçamento do `ArticleContent`.
