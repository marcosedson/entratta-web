'use client'
import { useState, useEffect } from 'react'
import { CORES_TAPETE } from '@/app/monte-o-seu/types'

interface Cfg {
  diasUteis: number
  coresDisponiveis: string[]
  aviso: string
}

const DEFAULT_CFG: Cfg = { diasUteis: 7, coresDisponiveis: CORES_TAPETE.map(c => c.id), aviso: '' }

export default function AdminPage() {
  const [senha, setSenha] = useState('')
  const [authed, setAuthed] = useState(false)
  const [erro, setErro] = useState('')
  const [cfg, setCfg] = useState<Cfg>(DEFAULT_CFG)
  const [salvando, setSalvando] = useState(false)
  const [saved, setSaved] = useState(false)
  const [senhaSession, setSenhaSession] = useState('')

  useEffect(() => {
    const s = sessionStorage.getItem('admin_senha')
    if (s) tryLogin(s, true)
  }, [])

  async function tryLogin(s: string, silent = false) {
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senha: s }),
    })
    if (res.ok) {
      sessionStorage.setItem('admin_senha', s)
      setSenhaSession(s)
      setAuthed(true)
      const cfg = await fetch('/api/admin/config').then(r => r.json())
      setCfg(cfg)
    } else if (!silent) {
      setErro('Senha incorreta')
    }
  }

  async function salvar() {
    setSalvando(true)
    const res = await fetch('/api/admin/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': senhaSession },
      body: JSON.stringify(cfg),
    })
    setSalvando(false)
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2500) }
  }

  function toggleCor(id: string) {
    setCfg(prev => ({
      ...prev,
      coresDisponiveis: prev.coresDisponiveis.includes(id)
        ? prev.coresDisponiveis.filter(c => c !== id)
        : [...prev.coresDisponiveis, id],
    }))
  }

  const card: React.CSSProperties = {
    background: 'rgba(255,255,255,.03)',
    border: '1px solid rgba(255,255,255,.07)',
    borderRadius: 14,
    padding: '20px 22px',
    marginBottom: 16,
  }
  const label: React.CSSProperties = {
    fontSize: '.6rem', fontWeight: 700, letterSpacing: 1.5,
    color: '#22C55E', textTransform: 'uppercase', marginBottom: 10, display: 'block',
  }

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: '#060E16', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 360, background: 'rgba(255,255,255,.03)', border: '1px solid rgba(34,197,94,.2)', borderRadius: 16, padding: 32 }}>
          <div style={{ fontFamily: 'var(--font-accent)', fontSize: '1.5rem', letterSpacing: 3, color: '#fff', marginBottom: 4 }}>ENTRATTA</div>
          <div style={{ fontSize: '.7rem', color: '#22C55E', fontWeight: 700, letterSpacing: 1, marginBottom: 24 }}>Painel Operacional</div>
          <input
            type="password"
            placeholder="Senha de acesso"
            value={senha}
            onChange={e => { setSenha(e.target.value); setErro('') }}
            onKeyDown={e => e.key === 'Enter' && tryLogin(senha)}
            style={{ width: '100%', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, padding: '10px 12px', color: '#E2E8F0', fontSize: '.9rem', outline: 'none', marginBottom: erro ? 6 : 12 }}
            autoFocus
          />
          {erro && <div style={{ color: '#EF4444', fontSize: '.75rem', marginBottom: 10 }}>{erro}</div>}
          <button
            onClick={() => tryLogin(senha)}
            style={{ width: '100%', padding: '11px', borderRadius: 9, border: 'none', background: 'linear-gradient(135deg,#22C55E,#15803D)', color: '#fff', fontWeight: 800, fontSize: '.9rem', cursor: 'pointer' }}
          >
            Entrar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#060E16', color: '#E2E8F0', fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ background: 'rgba(3,8,16,.97)', borderBottom: '2px solid #22C55E', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ fontFamily: 'var(--font-accent)', fontSize: '1.2rem', letterSpacing: 3, color: '#fff' }}>ENTRATTA</span>
          <span style={{ fontSize: '.75rem', color: '#22C55E', fontWeight: 700 }}>Configurações</span>
          <a href="/admin/integracoes" style={{ fontSize: '.75rem', color: '#64748B', textDecoration: 'none' }}>Integrações</a>
        </div>
        <button
          onClick={() => { sessionStorage.removeItem('admin_senha'); setAuthed(false) }}
          style={{ background: 'transparent', border: '1px solid rgba(255,255,255,.1)', color: '#94A3B8', borderRadius: 8, padding: '5px 12px', cursor: 'pointer', fontSize: '.75rem' }}
        >
          Sair
        </button>
      </div>

      <div style={{ maxWidth: 680, margin: '32px auto', padding: '0 20px 60px' }}>
        <h1 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', marginBottom: 6 }}>Configurações de Produção</h1>
        <p style={{ fontSize: '.8rem', color: '#64748B', marginBottom: 28 }}>
          Alterações entram em vigor imediatamente no configurador dos clientes.
        </p>

        {/* Dias úteis */}
        <div style={card}>
          <span style={label}>⏱ Prazo de produção</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <input
              type="number" min={1} max={30} value={cfg.diasUteis}
              onChange={e => setCfg(p => ({ ...p, diasUteis: Number(e.target.value) }))}
              style={{ width: 72, background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 8, padding: '8px 12px', color: '#E2E8F0', fontSize: '1.1rem', fontWeight: 700, textAlign: 'center', outline: 'none' }}
            />
            <span style={{ color: '#94A3B8', fontSize: '.9rem' }}>dias úteis após confirmação do pagamento</span>
          </div>
          <p style={{ fontSize: '.7rem', color: '#2E4A6A', marginTop: 8 }}>
            Este valor aparece no WhatsApp do cliente e no resumo final do configurador.
          </p>
        </div>

        {/* Cores disponíveis */}
        <div style={card}>
          <span style={label}>🎨 Cores disponíveis no estoque</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {CORES_TAPETE.map(cor => {
              const ativo = cfg.coresDisponiveis.includes(cor.id)
              return (
                <div
                  key={cor.id}
                  onClick={() => toggleCor(cor.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '7px 12px', borderRadius: 8, cursor: 'pointer',
                    border: `1.5px solid ${ativo ? '#22C55E' : 'rgba(255,255,255,.06)'}`,
                    background: ativo ? 'rgba(34,197,94,.08)' : 'rgba(255,255,255,.02)',
                    opacity: ativo ? 1 : 0.5,
                    transition: 'all .15s',
                  }}
                >
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: cor.hex, border: '1px solid rgba(255,255,255,.15)', flexShrink: 0 }} />
                  <span style={{ fontSize: '.78rem', fontWeight: 600, color: ativo ? '#E2E8F0' : '#64748B' }}>{cor.label}</span>
                  <span style={{ fontSize: '.65rem', color: ativo ? '#22C55E' : '#EF4444', fontWeight: 700 }}>
                    {ativo ? '✓' : '✗'}
                  </span>
                </div>
              )
            })}
          </div>
          <p style={{ fontSize: '.7rem', color: '#2E4A6A', marginTop: 10 }}>
            Cores desmarcadas ficam ocultas no configurador. Clique para ativar/desativar.
          </p>
        </div>

        {/* Aviso ao cliente */}
        <div style={card}>
          <span style={label}>⚠️ Aviso ao cliente (opcional)</span>
          <textarea
            value={cfg.aviso}
            onChange={e => setCfg(p => ({ ...p, aviso: e.target.value }))}
            placeholder="Ex: Estamos com alta demanda — prazo pode estender 2 dias úteis."
            rows={3}
            style={{ width: '100%', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 8, padding: '9px 11px', color: '#E2E8F0', fontSize: '.85rem', resize: 'vertical', outline: 'none', fontFamily: 'inherit' }}
          />
          <p style={{ fontSize: '.7rem', color: '#2E4A6A', marginTop: 6 }}>
            Aparece em destaque no topo do configurador quando preenchido.
          </p>
        </div>

        {/* Save */}
        <button
          onClick={salvar}
          disabled={salvando}
          style={{
            width: '100%', padding: '13px', borderRadius: 10,
            border: saved ? '1px solid #22C55E' : '1px solid transparent',
            background: saved ? 'rgba(34,197,94,.2)' : 'linear-gradient(135deg,#22C55E,#15803D)',
            color: saved ? '#22C55E' : '#fff', fontWeight: 800, fontSize: '1rem',
            cursor: salvando ? 'wait' : 'pointer', transition: 'all .2s',
          } as React.CSSProperties}
        >
          {salvando ? 'Salvando...' : saved ? '✓ Salvo com sucesso!' : 'Salvar configurações'}
        </button>

        {/* URL template */}
        <div style={{ ...card, marginTop: 32, background: 'rgba(30,58,95,.15)', border: '1px solid rgba(30,58,95,.4)' }}>
          <span style={{ ...label, color: '#60A5FA' }}>🛒 Template de URL para ML/Shopee</span>
          <p style={{ fontSize: '.75rem', color: '#94A3B8', marginBottom: 10, lineHeight: 1.6 }}>
            Configure na mensagem pós-compra do ML/Shopee. Substitua os valores conforme o produto:
          </p>
          {[
            { label: 'Tapete Preto 60×90', url: '/monte-o-seu?tamanho=60x90&cor=preto&pedido={order_id}&canal=ml' },
            { label: 'Tapete Verde 40×60', url: '/monte-o-seu?tamanho=40x60&cor=verde&pedido={order_id}&canal=ml' },
            { label: 'Shopee genérico', url: '/monte-o-seu?tamanho=60x90&cor=preto&pedido={order_id}&canal=shopee' },
          ].map(ex => (
            <div key={ex.label} style={{ marginBottom: 8 }}>
              <div style={{ fontSize: '.65rem', color: '#60A5FA', fontWeight: 700, marginBottom: 3 }}>{ex.label}</div>
              <code style={{
                display: 'block', background: 'rgba(0,0,0,.3)', padding: '7px 10px',
                borderRadius: 6, fontSize: '.7rem', color: '#4ADE80',
                wordBreak: 'break-all', fontFamily: 'monospace',
              }}>
                {`https://entratta.com.br${ex.url}`}
              </code>
            </div>
          ))}
          <p style={{ fontSize: '.68rem', color: '#2E4A6A', marginTop: 8, lineHeight: 1.6 }}>
            No ML: <strong style={{ color: '#60A5FA' }}>{'{{order.id}}'}</strong> ou <strong style={{ color: '#60A5FA' }}>{'{order_id}'}</strong> — verifique o template disponível na sua conta vendedor.
          </p>
        </div>
      </div>
    </div>
  )
}
