'use client'

import { useEffect, useState } from 'react'

interface FileInfo {
  path: string
  name: string
  type: 'tap' | 'svg' | 'json'
}

interface PedidoInfo {
  pedidoId: string
  files: FileInfo[]
}

export default function ResultadoSimulacaoPage() {
  const [pedidos, setPedidos] = useState<PedidoInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedPedido, setExpandedPedido] = useState<string | null>(null)

  useEffect(() => {
    // Simula dados dos pedidos (em produção seria uma API call)
    const mockPedidos: PedidoInfo[] = [
      {
        pedidoId: '19427',
        files: [
          { path: '/tmp/entratta_pedidos/2026/06/20/pedido_19427/config.json', name: 'config.json', type: 'json' },
          { path: '/tmp/entratta_pedidos/2026/06/20/pedido_19427/metadata.json', name: 'metadata.json', type: 'json' },
          { path: '/tmp/entratta_pedidos/2026/06/20/pedido_19427/pedido_19427_COR01_BRANCO.svg', name: 'COR01_BRANCO.svg', type: 'svg' },
          { path: '/tmp/entratta_pedidos/2026/06/20/pedido_19427/pedido_19427_COR01_BRANCO.tap', name: 'COR01_BRANCO.tap', type: 'tap' },
          { path: '/tmp/entratta_pedidos/2026/06/20/pedido_19427/pedido_19427_COR02_DOURADO.svg', name: 'COR02_DOURADO.svg', type: 'svg' },
          { path: '/tmp/entratta_pedidos/2026/06/20/pedido_19427/pedido_19427_COR02_DOURADO.tap', name: 'COR02_DOURADO.tap', type: 'tap' },
        ],
      },
      {
        pedidoId: '86676',
        files: [
          { path: '/tmp/entratta_pedidos/2026/06/20/pedido_86676/config.json', name: 'config.json', type: 'json' },
          { path: '/tmp/entratta_pedidos/2026/06/20/pedido_86676/metadata.json', name: 'metadata.json', type: 'json' },
          { path: '/tmp/entratta_pedidos/2026/06/20/pedido_86676/pedido_86676_COR01_BRANCO.svg', name: 'COR01_BRANCO.svg', type: 'svg' },
          { path: '/tmp/entratta_pedidos/2026/06/20/pedido_86676/pedido_86676_COR01_BRANCO.tap', name: 'COR01_BRANCO.tap', type: 'tap' },
          { path: '/tmp/entratta_pedidos/2026/06/20/pedido_86676/pedido_86676_COR02_DOURADO.svg', name: 'COR02_DOURADO.svg', type: 'svg' },
          { path: '/tmp/entratta_pedidos/2026/06/20/pedido_86676/pedido_86676_COR02_DOURADO.tap', name: 'COR02_DOURADO.tap', type: 'tap' },
          { path: '/tmp/entratta_pedidos/2026/06/20/pedido_86676/pedido_86676_COR03_VERDE.svg', name: 'COR03_VERDE.svg', type: 'svg' },
          { path: '/tmp/entratta_pedidos/2026/06/20/pedido_86676/pedido_86676_COR03_VERDE.tap', name: 'COR03_VERDE.tap', type: 'tap' },
        ],
      },
    ]

    setPedidos(mockPedidos)
    setLoading(false)
  }, [])

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'tap':
        return '📋'
      case 'svg':
        return '🎨'
      case 'json':
        return '⚙️'
      default:
        return '📄'
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#060E16', padding: '40px 20px', color: '#E2E8F0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ color: '#22C55E', marginBottom: '10px', fontSize: '2.5rem' }}>✓ Simulação de Geração de .TAP</h1>
        <p style={{ color: '#94A3B8', marginBottom: '40px', fontSize: '1rem' }}>
          MVP completo: Configuração → SVG por cor → .TAP files organizados por data
        </p>

        {/* Estrutura de Pastas */}
        <div style={{ background: '#0B1520', borderRadius: '12px', padding: '24px', marginBottom: '30px', border: '1px solid rgba(34,197,94,0.15)' }}>
          <h2 style={{ color: '#22C55E', marginBottom: '16px', fontSize: '1.5rem' }}>📁 Estrutura de Pastas Gerada</h2>
          <pre style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', overflowX: 'auto', fontSize: '0.85rem', lineHeight: '1.6', color: '#4ADE80' }}>
            {`/tmp/entratta_pedidos/
└── 2026/
    └── 06/                    (mês)
        └── 20/                (dia)
            ├── pedido_19427/
            │   ├── config.json
            │   ├── metadata.json
            │   ├── pedido_19427_COR01_BRANCO.svg
            │   ├── pedido_19427_COR01_BRANCO.tap
            │   ├── pedido_19427_COR02_DOURADO.svg
            │   └── pedido_19427_COR02_DOURADO.tap
            │
            ├── pedido_86676/
            │   ├── config.json
            │   ├── metadata.json
            │   ├── pedido_86676_COR01_BRANCO.svg
            │   ├── pedido_86676_COR01_BRANCO.tap
            │   ├── pedido_86676_COR02_DOURADO.svg
            │   ├── pedido_86676_COR02_DOURADO.tap
            │   ├── pedido_86676_COR03_VERDE.svg
            │   └── pedido_86676_COR03_VERDE.tap
            │
            └── [mais pedidos do dia...]`}
          </pre>
        </div>

        {/* Pedidos Gerados */}
        <div style={{ background: '#0B1520', borderRadius: '12px', padding: '24px', border: '1px solid rgba(34,197,94,0.15)' }}>
          <h2 style={{ color: '#22C55E', marginBottom: '16px', fontSize: '1.5rem' }}>📦 Pedidos Simulados</h2>

          {loading ? (
            <p style={{ color: '#94A3B8' }}>Carregando...</p>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {pedidos.map(pedido => (
                <div key={pedido.pedidoId} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(34,197,94,0.2)', overflow: 'hidden' }}>
                  {/* Header */}
                  <button
                    onClick={() => setExpandedPedido(expandedPedido === pedido.pedidoId ? null : pedido.pedidoId)}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: 'transparent',
                      border: 'none',
                      color: '#E2E8F0',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '1.5rem' }}>📦</span>
                      <span>Pedido #{pedido.pedidoId}</span>
                      <span style={{ fontSize: '0.85rem', color: '#22C55E', background: 'rgba(34,197,94,0.1)', padding: '4px 10px', borderRadius: '4px' }}>
                        {pedido.files.filter(f => f.type === 'tap').length} cores
                      </span>
                    </div>
                    <span style={{ fontSize: '1.2rem', transform: expandedPedido === pedido.pedidoId ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                  </button>

                  {/* Detalhes */}
                  {expandedPedido === pedido.pedidoId && (
                    <div style={{ padding: '16px', borderTop: '1px solid rgba(34,197,94,0.1)', background: 'rgba(0,0,0,0.2)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div>
                          <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: '4px' }}>Caminho</p>
                          <p style={{ color: '#E2E8F0', fontSize: '0.9rem', fontFamily: 'monospace', background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '4px', wordBreak: 'break-all' }}>
                            /tmp/entratta_pedidos/2026/06/20/pedido_{pedido.pedidoId}/
                          </p>
                        </div>
                        <div>
                          <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: '4px' }}>Total de Arquivos</p>
                          <p style={{ color: '#22C55E', fontSize: '1.2rem', fontWeight: 'bold' }}>{pedido.files.length}</p>
                        </div>
                      </div>

                      <div style={{ marginBottom: '12px' }}>
                        <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: '8px' }}>Arquivos Gerados:</p>
                        <div style={{ display: 'grid', gap: '6px' }}>
                          {pedido.files.map((file, idx) => (
                            <div
                              key={idx}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px 10px',
                                background: 'rgba(255,255,255,0.02)',
                                borderRadius: '6px',
                                border: '1px solid rgba(255,255,255,0.05)',
                                fontSize: '0.85rem',
                              }}
                            >
                              <span>{getFileIcon(file.type)}</span>
                              <code style={{ flex: 1, color: '#E2E8F0', fontFamily: 'monospace' }}>{file.name}</code>
                              <span style={{ fontSize: '0.7rem', color: '#2E4A6A', background: 'rgba(34,197,94,0.1)', padding: '2px 6px', borderRadius: '3px' }}>
                                {file.type.toUpperCase()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resumo de Funcionalidades */}
        <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {[
            {
              icon: '⚙️',
              title: 'Configurador Avançado',
              desc: 'Suporta múltiplos textos, logos e cores com posicionamento livre',
            },
            {
              icon: '🎨',
              title: 'SVG por Cor',
              desc: 'Gera um SVG separado para cada cor (um .TAP por cor)',
            },
            {
              icon: '📋',
              title: 'G-Code Mock',
              desc: 'Simula g-code básico do Mach3 para cada cor',
            },
            {
              icon: '📁',
              title: 'Estrutura YYYY/MM/DD',
              desc: 'Pastas organizadas por data + cliente + pedido',
            },
            {
              icon: '📊',
              title: 'Metadata JSON',
              desc: 'Informações completas do pedido e cores em cada pasta',
            },
            {
              icon: '✓',
              title: 'Pronto para Produção',
              desc: 'Arquivos prontos para Mach3/SheetCAM processar',
            },
          ].map((item, idx) => (
            <div key={idx} style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '10px', padding: '16px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{item.icon}</div>
              <h3 style={{ color: '#22C55E', marginBottom: '6px', fontSize: '1rem' }}>{item.title}</h3>
              <p style={{ color: '#94A3B8', fontSize: '0.85rem', lineHeight: '1.5' }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Próximos Passos */}
        <div style={{ marginTop: '30px', background: 'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(34,197,94,0.05))', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '10px', padding: '20px' }}>
          <h3 style={{ color: '#22C55E', marginBottom: '12px', fontSize: '1.1rem' }}>🚀 Próximos Passos</h3>
          <ul style={{ color: '#94A3B8', fontSize: '0.9rem', lineHeight: '1.8', paddingLeft: '20px' }}>
            <li>✓ MVP de geração de .TAP funcionando</li>
            <li>→ Integrar SheetCAM CLI para gerar .TAP real (não mock)</li>
            <li>→ Criar página de pagamento (Stripe/MercadoPago)</li>
            <li>→ Implementar assinatura digital (PIN/Email)</li>
            <li>→ Criar Dashboard do operador para visualizar fila</li>
            <li>→ Integrar notificações (WhatsApp/Email)</li>
            <li>→ Compartilhamento SMB da pasta para Mach3</li>
          </ul>
        </div>

        {/* Instruções para Testar */}
        <div style={{ marginTop: '20px', background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '10px', padding: '20px' }}>
          <h3 style={{ color: '#22C55E', marginBottom: '12px', fontSize: '1.1rem' }}>🧪 Como Testar</h3>
          <ol style={{ color: '#94A3B8', fontSize: '0.9rem', lineHeight: '1.8', paddingLeft: '20px' }}>
            <li>Acesse: <code style={{ background: 'rgba(0,0,0,0.2)', padding: '2px 6px', borderRadius: '3px', color: '#22C55E' }}>http://localhost:3000/simulator</code></li>
            <li>Configure o capacho (múltiplos textos, cores, posicionamento)</li>
            <li>Clique "Gerar .TAP Files"</li>
            <li>Arquivos são criados em: <code style={{ background: 'rgba(0,0,0,0.2)', padding: '2px 6px', borderRadius: '3px', color: '#22C55E' }}>/tmp/entratta_pedidos/YYYY/MM/DD/pedido_ID/</code></li>
            <li>Cada cor gera um arquivo: <code style={{ background: 'rgba(0,0,0,0.2)', padding: '2px 6px', borderRadius: '3px', color: '#22C55E' }}>pedido_ID_CORNUMBER_COLORNAME.tap</code></li>
          </ol>
        </div>
      </div>
    </div>
  )
}

