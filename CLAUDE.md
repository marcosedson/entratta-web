@AGENTS.md

## Protocolo de investigação (economia de tokens)

1. **grep antes de ler**: `grep -rn "símbolo" app/ components/ --include="*.tsx" -l`
2. **mapa primeiro**: o mapa em AGENTS.md responde 80% das perguntas de localização
3. **Read com offset+limit**: quando souber o trecho, nunca leia o arquivo inteiro
4. **parallel tool calls**: todas as queries independentes em paralelo
5. **API routes**: sempre em `app/api/<recurso>/<ação>/route.ts`
6. **✗ find sem filtro**: sempre `-name "*.tsx"` ou `-name "*.ts"` + diretório específico

## Comportamento

- ✗ comentários óbvios, docstrings, resumos pós-tarefa
- ✗ features além do pedido, error handling para cenários impossíveis
- ✗ criar arquivos `.md` de planejamento — trabalhar do contexto da conversa
- ✓ confirmar antes de ações destrutivas ou irreversíveis
- ✓ verificar memória em `/Users/marcosmarcon/.claude/projects/-Users-marcosmarcon-projetos-entratta-web/memory/` quando contexto de sessão anterior for relevante
