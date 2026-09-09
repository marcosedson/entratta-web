'use client'

import { useCallback, useEffect, useState } from 'react'

import type { PedidoStatus } from '@/lib/types/producao'

interface PedidoResumo {
  orderId: string
  criadoEm: string
  status: PedidoStatus
  cliente: { nome: string; whatsapp: string }
  quantidade: number
  medida: string
}

const STATUS_LABEL: Record<PedidoStatus, { label: string; cor: string }> = {
  novo: { label: 'Novo', cor: '#60A5FA' },
  em_producao: { label: 'Em produção', cor: '#EAB308' },
  concluido: { label: 'Concluído', cor: '#22C55E' },
}

const box: React.CSSProperties = {
  background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)',
  borderRadius: 12, padding: 16,
}

export default function AdminPedidosPage() {
  const [senha, setSenha] = useState('')
  const [logado, setLogado] = useState(false)
  const [erro, setErro] = useState('')
  const [pedidos, setPedidos] = useState<PedidoResumo[]>([])
  const [aberto, setAberto] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const authHeaders = useCallback((): Record<string, string> => ({
    'x-admin-password': sessionStorage.getItem('admin_senha') ?? '',
  }), [])

  const carregar = useCallback(async () => {
    const res = await fetch('/api/admin/pedidos', { headers: authHeaders() })
    if (res.status === 401) { setLogado(false); return }
    const data = await res.json()
    setPedidos(data.pedidos ?? [])
  }, [authHeaders])

  useEffect(() => {
    if (!sessionStorage.getItem('admin_senha')) return
    queueMicrotask(() => {
      setLogado(true)
      carregar()
    })
  }, [carregar])

  async function entrar() {
    setErro('')
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senha }),
    })
    if (!res.ok) { setErro('Senha incorreta'); return }
    sessionStorage.setItem('admin_senha', senha)
    setLogado(true)
    carregar()
  }

  async function abrirPreview(orderId: string) {
    setAberto(orderId)
    setPreviewUrl(null)
    const res = await fetch(`/api/admin/pedidos/${orderId}/arquivo?tipo=preview`, { headers: authHeaders() })
    if (res.ok) setPreviewUrl(URL.createObjectURL(await res.blob()))
  }

  async function baixarZip(orderId: string) {
    const res = await fetch(`/api/admin/pedidos/${orderId}/arquivo?tipo=zip`, { headers: authHeaders() })
    if (!res.ok) return
    const url = URL.createObjectURL(await res.blob())
    const a = document.createElement('a')
    a.href = url
    a.download = `${orderId}-producao.zip`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function mudarStatus(orderId: string, status: PedidoStatus) {
    await fetch(`/api/admin/pedidos/${orderId}`, {
      method: 'PATCH',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    carregar()
  }

  if (!logado) {
    return (
      <div style={{ minHeight: '100vh', background: '#060E16', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter',sans-serif" }}>
        <div style={{ ...box, width: 320 }}>
          <h1 style={{ color: '#22C55E', fontSize: '1rem', fontWeight: 800, marginBottom: 12 }}>Painel de Pedidos</h1>
          <input
            type="password" placeholder="Senha" value={senha}
            onChange={e => setSenha(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && entrar()}
            style={{ width: '100%', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, padding: '10px 12px', color: '#E2E8F0', marginBottom: 10 }}
          />
          {erro && <div style={{ color: '#F87171', fontSize: '.75rem', marginBottom: 8 }}>{erro}</div>}
          <button onClick={entrar} style={{ width: '100%', padding: '10px 0', borderRadius: 8, border: 'none', background: '#22C55E', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>
            Entrar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#060E16', color: '#E2E8F0', fontFamily: "'Inter',sans-serif", padding: '24px 20px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h1 style={{ color: '#22C55E', fontSize: '1.1rem', fontWeight: 800 }}>Pedidos de produção</h1>
          <button onClick={carregar} style={{ background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.3)', color: '#22C55E', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: '.75rem', fontWeight: 700 }}>
            ↻ Atualizar
          </button>
        </div>

        {pedidos.length === 0 && (
          <div style={{ ...box, color: '#64748B', fontSize: '.85rem' }}>Nenhum pedido ainda.</div>
        )}

        {pedidos.map(p => (
          <div key={p.orderId} style={{ ...box, marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <div>
                <span style={{ fontWeight: 800, color: '#E2E8F0' }}>{p.orderId}</span>
                <span style={{ marginLeft: 10, fontSize: '.72rem', color: STATUS_LABEL[p.status].cor, fontWeight: 700 }}>
                  ● {STATUS_LABEL[p.status].label}
                </span>
                <div style={{ fontSize: '.72rem', color: '#94A3B8', marginTop: 3 }}>
                  {p.cliente.nome} · {p.cliente.whatsapp} · {p.medida} · {p.quantidade}un ·{' '}
                  {new Date(p.criadoEm).toLocaleString('pt-BR')}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <button onClick={() => abrirPreview(p.orderId)} style={{ background: 'rgba(96,165,250,.1)', border: '1px solid rgba(96,165,250,.3)', color: '#60A5FA', borderRadius: 7, padding: '6px 12px', cursor: 'pointer', fontSize: '.72rem', fontWeight: 700 }}>
                  Ver prévia
                </button>
                <button onClick={() => baixarZip(p.orderId)} style={{ background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.3)', color: '#22C55E', borderRadius: 7, padding: '6px 12px', cursor: 'pointer', fontSize: '.72rem', fontWeight: 700 }}>
                  ⬇ Baixar .tap (zip)
                </button>
                {p.status === 'novo' && (
                  <button onClick={() => mudarStatus(p.orderId, 'em_producao')} style={{ background: 'rgba(234,179,8,.1)', border: '1px solid rgba(234,179,8,.3)', color: '#EAB308', borderRadius: 7, padding: '6px 12px', cursor: 'pointer', fontSize: '.72rem', fontWeight: 700 }}>
                    Iniciar produção
                  </button>
                )}
                {p.status === 'em_producao' && (
                  <button onClick={() => mudarStatus(p.orderId, 'concluido')} style={{ background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.3)', color: '#22C55E', borderRadius: 7, padding: '6px 12px', cursor: 'pointer', fontSize: '.72rem', fontWeight: 700 }}>
                    Concluir
                  </button>
                )}
              </div>
            </div>

            {aberto === p.orderId && previewUrl && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: '.65rem', color: '#4ADE80', fontWeight: 700, marginBottom: 6 }}>PRÉVIA APROVADA PELO CLIENTE</div>
                {/* prévia dinâmica autenticada via blob — next/image não se aplica */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl} alt={`Prévia aprovada do pedido ${p.orderId}`} style={{ maxWidth: '100%', borderRadius: 8 }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
