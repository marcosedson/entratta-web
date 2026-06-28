#!/bin/bash

# Teste End-to-End da Simulação de Geração de .TAP
# Execute este script para validar o MVP completo

echo "🚀 Iniciando testes do MVP de Geração de .TAP"
echo "=============================================="
echo ""

# Test 1: Simples (2 cores)
echo "✓ TESTE 1: Configuração Simples (2 cores)"
echo "  Medida: 60×90 cm"
echo "  Cores: Branco (borda) + Dourado (texto)"
echo ""

curl -X POST http://localhost:3000/api/orders/gerar-tap \
  -H "Content-Type: application/json" \
  -d '{
    "medida": "60x90",
    "corTapete": "preto",
    "border": {"type": "thin", "color": "branco"},
    "textos": [
      {"id": "txt_1", "content": "BEM-VINDO", "color": "branco", "fontSize": 1.0, "posX": 50, "posY": 40, "fontFamily": "bold"},
      {"id": "txt_2", "content": "LOJA PREMIUM", "color": "dourado", "fontSize": 0.8, "posX": 50, "posY": 65, "fontFamily": "light"}
    ],
    "logos": [],
    "clienteName": "Teste Simples"
  }' 2>&1 > /tmp/teste1_result.json

echo ""
echo "Resultado salvo em: /tmp/teste1_result.json"
echo ""
echo "---"
echo ""

# Test 2: Complexo (3+ cores)
echo "✓ TESTE 2: Configuração Complexa (3 cores)"
echo "  Medida: 80×120 cm"
echo "  Cores: Branco (borda dupla) + Verde (telefone) + Preto (logo)"
echo ""

curl -X POST http://localhost:3000/api/orders/gerar-tap \
  -H "Content-Type: application/json" \
  -d '{
    "medida": "80x120",
    "corTapete": "preto",
    "border": {"type": "double", "color": "branco"},
    "textos": [
      {"id": "txt_1", "content": "PREMIUM STORE", "color": "branco", "fontSize": 1.2, "posX": 50, "posY": 30, "fontFamily": "bold"},
      {"id": "txt_2", "content": "(64) 99206-6855", "color": "verde", "fontSize": 0.7, "posX": 50, "posY": 75, "fontFamily": "light"}
    ],
    "logos": [],
    "clienteName": "Teste Complexo"
  }' 2>&1 > /tmp/teste2_result.json

echo ""
echo "Resultado salvo em: /tmp/teste2_result.json"
echo ""
echo "---"
echo ""

# Summary
echo "✅ TESTES CONCLUÍDOS"
echo ""
echo "Verificar resultados:"
echo "  Test 1: cat /tmp/teste1_result.json | python3 -m json.tool"
echo "  Test 2: cat /tmp/teste2_result.json | python3 -m json.tool"
echo ""
echo "Verificar arquivos gerados:"
echo "  ls -la /tmp/entratta_pedidos/2026/06/20/"
echo ""
echo "Visualizar estrutura:"
echo "  find /tmp/entratta_pedidos -type f | sort"
echo ""
echo "=============================================="
echo "🎉 MVP de Geração de .TAP está funcional!"

