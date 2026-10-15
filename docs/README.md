# Docs do entratta-web

Procure por assunto: `grep -n '^## ' docs/troubleshooting.md docs/negocio.md`

| Doc | Para quê |
|---|---|
| [arquitetura.md](arquitetura.md) | stack, rotas e middleware, fonte única dos dados, camadas de `lib/`, animação, formato do blog, fluxo pedido → produção |
| [negocio.md](negocio.md) | produto, paleta ACI, preço/WhatsApp, posicionamento, SEO local, schema, medição |
| [operacao.md](operacao.md) | deploy (Coolify), Docker, variáveis, pasta Samba de pedidos, checagem no navegador |
| [troubleshooting.md](troubleshooting.md) | problemas conhecidos por assunto (sintoma / causa / correção) |
| [analytics/setup.md](analytics/setup.md) | eventos GA4 rastreados, metas, como testar |
| [analytics/consultas.md](analytics/consultas.md) | relatórios/explorações prontos no GA4 |
| [analytics/looker-studio.md](analytics/looker-studio.md) | montar o dashboard executivo no Looker Studio |
| [estudos/integracao-mach3.md](estudos/integracao-mach3.md) | estudo: integrar a fila de pedidos ao Mach3 (pasta observada) |
| [estudos/processamento-logo.md](estudos/processamento-logo.md) | estudo: logo → vetor → um `.tap` por cor |
| [estudos/vetorizacao-avancada.md](estudos/vetorizacao-avancada.md) | estudo: vetorização em várias etapas (OpenCV/Potrace) |
| [historico/plano-refatoracao-solid.md](historico/plano-refatoracao-solid.md) | análise SOLID/DRY e plano de refatoração em camadas (base de `lib/`) |
| [../services/production/README.md](../services/production/README.md) | serviço de produção: endpoints, paleta ACI, G-code, validação, dev local |
