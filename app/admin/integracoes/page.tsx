'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

interface Status {
  ml: { ok: boolean; user_id?: number; expira?: string }
  shopee: { ok: boolean; shop_id?: number; expira?: string }
  evolution: { ok: boolean }
}

function IntegracoesPainel() {
  const params = useSearchParams()
  const [authed, setAuthed] = useState(false)
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [status, setStatus] = useState<Status | null>(null)
  const [flash, setFlash] = useState(params.get('ml') === 'ok' ? 'ML conectado!' : params.get('shopee') === 'ok' ? 'Shopee conectado!' : '')

  useEffect(() => {
    const s = sessionStorage.getItem('admin_senha')
    if (s) tryLogin(s, true)
    if (flash) setTimeout(() => setFlash(''), 4000)
  }, [])

  async function tryLogin(s: string, silent = false) {
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senha: s }),
    })
    if (res.ok) {
      sessionStorage.setItem('admin_senha', s)
      setAuthed(true)
      const st = await fetch('/api/admin/integrations-status').then(r => r.json())
      setStatus(st)
    } else if (!silent) setErro('Senha incorreta')
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
    textTransform: 'uppercase', marginBottom: 10, display: 'block',
  }
  const badge = (ok: boolean) => ({
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: 20,
    fontSize: '.65rem',
    fontWeight: 700,
    background: ok ? 'rgba(34,197,94,.15)' : 'rgba(239,68,68,.12)',
    color: ok ? '#22C55E' : '#EF4444',
    border: `1px solid ${ok ? 'rgba(34,197,94,.3)' : 'rgba(239,68,68,.3)'}`,
  } as React.CSSProperties)

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: '#060E16', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 360, background: 'rgba(255,255,255,.03)', border: '1px solid rgba(34,197,94,.2)', borderRadius: 16, padding: 32 }}>
          <div style={{ fontFamily: 'var(--font-accent)', fontSize: '1.5rem', letterSpacing: 3, color: '#fff', marginBottom: 4 }}>ENTRATTA</div>
          <div style={{ fontSize: '.7rem', color: '#22C55E', fontWeight: 700, letterSpacing: 1, marginBottom: 24 }}>Integrações</div>
          <input
            type="password" placeholder="Senha de acesso" value={senha}
            onChange={e => { setSenha(e.target.value); setErro('') }}
            onKeyDown={e => e.key === 'Enter' && tryLogin(senha)}
            style={{ width: '100%', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, padding: '10px 12px', color: '#E2E8F0', fontSize: '.9rem', outline: 'none', marginBottom: erro ? 6 : 12 }}
            autoFocus
          />
          {erro && <div style={{ color: '#EF4444', fontSize: '.75rem', marginBottom: 10 }}>{erro}</div>}
          <button onClick={() => tryLogin(senha)} style={{ width: '100%', padding: 11, borderRadius: 9, border: 'none', background: 'linear-gradient(135deg,#22C55E,#15803D)', color: '#fff', fontWeight: 800, fontSize: '.9rem', cursor: 'pointer' }}>
            Entrar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#060E16', color: '#E2E8F0', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: 'rgba(3,8,16,.97)', borderBottom: '2px solid #22C55E', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ fontFamily: 'var(--font-accent)', fontSize: '1.2rem', letterSpacing: 3, color: '#fff' }}>ENTRATTA</span>
          <a href="/admin" style={{ fontSize: '.75rem', color: '#64748B', textDecoration: 'none' }}>Configurações</a>
          <span style={{ fontSize: '.75rem', color: '#22C55E', fontWeight: 700 }}>Integrações</span>
        </div>
        <button onClick={() => { sessionStorage.removeItem('admin_senha'); setAuthed(false) }} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,.1)', color: '#94A3B8', borderRadius: 8, padding: '5px 12px', cursor: 'pointer', fontSize: '.75rem' }}>
          Sair
        </button>
      </div>

      <div style={{ maxWidth: 700, margin: '32px auto', padding: '0 20px 80px' }}>
        {flash && (
          <div style={{ background: 'rgba(34,197,94,.15)', border: '1px solid #22C55E', borderRadius: 10, padding: '10px 16px', marginBottom: 20, color: '#22C55E', fontWeight: 700, fontSize: '.85rem' }}>
            ✓ {flash}
          </div>
        )}

        <h1 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', marginBottom: 6 }}>Integrações de Marketplace</h1>
        <p style={{ fontSize: '.8rem', color: '#64748B', marginBottom: 28 }}>
          Configure as APIs para disparo automático de mensagens e notificações de novos pedidos.
        </p>

        {/* Evolution API */}
        <div style={card}>
          <span style={{ ...label, color: '#4ADE80' }}>📲 Evolution API (WhatsApp)</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <span style={badge(status?.evolution.ok ?? false)}>
              {status?.evolution.ok ? 'Configurado' : 'Não configurado'}
            </span>
          </div>
          <p style={{ fontSize: '.75rem', color: '#94A3B8', marginBottom: 10, lineHeight: 1.6 }}>
            Notificações de novos pedidos enviadas para o grupo do WhatsApp. Configure no <code style={{ color: '#4ADE80', background: 'rgba(0,0,0,.3)', padding: '1px 5px', borderRadius: 4 }}>.env.local</code>:
          </p>
          <pre style={{ background: 'rgba(0,0,0,.4)', borderRadius: 8, padding: '12px 14px', fontSize: '.72rem', color: '#4ADE80', overflowX: 'auto', lineHeight: 1.8 }}>
{`EVOLUTION_API_URL=https://evo.marconlabs.com.br
EVOLUTION_API_KEY=sua-api-key
EVOLUTION_INSTANCE=nome-da-instancia
EVOLUTION_GROUP_JID=120363XXXXXXXX@g.us`}
          </pre>
          <p style={{ fontSize: '.68rem', color: '#2E4A6A', marginTop: 8 }}>
            Para obter o JID do grupo: no Evolution Manager, abra a instância → Contatos → localize o grupo e copie o ID (termina em <code>@g.us</code>).
          </p>
        </div>

        {/* Mercado Livre */}
        <div style={card}>
          <span style={{ ...label, color: '#FBBF24' }}>🛒 Mercado Livre</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <span style={badge(status?.ml.ok ?? false)}>
              {status?.ml.ok ? `Conectado (user ${status.ml.user_id})` : 'Não conectado'}
            </span>
            {status?.ml.ok && (
              <span style={{ fontSize: '.65rem', color: '#64748B' }}>
                Token expira: {status.ml.expira ? new Date(status.ml.expira).toLocaleDateString('pt-BR') : '—'}
              </span>
            )}
          </div>

          {!status?.ml.ok && (
            <a href="/api/auth/ml" style={{ display: 'inline-block', padding: '9px 18px', borderRadius: 8, background: 'rgba(251,191,36,.15)', border: '1px solid rgba(251,191,36,.4)', color: '#FBBF24', fontWeight: 700, fontSize: '.8rem', textDecoration: 'none', marginBottom: 14 }}>
              Conectar conta ML
            </a>
          )}

          <div style={{ background: 'rgba(0,0,0,.3)', borderRadius: 8, padding: '12px 14px', marginBottom: 10 }}>
            <p style={{ fontSize: '.72rem', color: '#94A3B8', marginBottom: 6, fontWeight: 700 }}>Pré-requisitos:</p>
            <ol style={{ fontSize: '.72rem', color: '#64748B', paddingLeft: 18, lineHeight: 2 }}>
              <li>Acesse <code style={{ color: '#FBBF24' }}>developers.mercadolivre.com.br</code> → Criar aplicação</li>
              <li>Adicione <code style={{ color: '#4ADE80' }}>https://entratta.com.br/api/auth/ml</code> como Redirect URI</li>
              <li>Ative o escopo <strong>read</strong> (orders) e <strong>write</strong> (messages)</li>
              <li>Copie o App ID e Client Secret para o <code>.env.local</code></li>
            </ol>
            <pre style={{ background: 'rgba(0,0,0,.4)', borderRadius: 6, padding: '8px 10px', fontSize: '.7rem', color: '#FBBF24', marginTop: 8 }}>
{`ML_APP_ID=seu-app-id
ML_CLIENT_SECRET=seu-client-secret`}
            </pre>
          </div>

          <div style={{ background: 'rgba(0,0,0,.3)', borderRadius: 8, padding: '12px 14px' }}>
            <p style={{ fontSize: '.72rem', color: '#94A3B8', marginBottom: 6, fontWeight: 700 }}>Webhook (configurar no painel ML Developers):</p>
            <code style={{ display: 'block', color: '#4ADE80', fontSize: '.73rem', wordBreak: 'break-all' }}>
              https://entratta.com.br/api/webhooks/ml
            </code>
            <p style={{ fontSize: '.68rem', color: '#2E4A6A', marginTop: 6 }}>Tópico: <strong>orders_v2</strong></p>
          </div>
        </div>

        {/* Shopee */}
        <div style={card}>
          <span style={{ ...label, color: '#F97316' }}>🛍️ Shopee</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <span style={badge(status?.shopee.ok ?? false)}>
              {status?.shopee.ok ? `Conectado (shop ${status.shopee.shop_id})` : 'Não conectado'}
            </span>
            {status?.shopee.ok && (
              <span style={{ fontSize: '.65rem', color: '#64748B' }}>
                Token expira: {status.shopee.expira ? new Date(status.shopee.expira).toLocaleDateString('pt-BR') : '—'}
              </span>
            )}
          </div>

          {!status?.shopee.ok && (
            <a href="/api/auth/shopee" style={{ display: 'inline-block', padding: '9px 18px', borderRadius: 8, background: 'rgba(249,115,22,.15)', border: '1px solid rgba(249,115,22,.4)', color: '#F97316', fontWeight: 700, fontSize: '.8rem', textDecoration: 'none', marginBottom: 14 }}>
              Conectar conta Shopee
            </a>
          )}

          <div style={{ background: 'rgba(0,0,0,.3)', borderRadius: 8, padding: '12px 14px', marginBottom: 10 }}>
            <p style={{ fontSize: '.72rem', color: '#94A3B8', marginBottom: 6, fontWeight: 700 }}>Pré-requisitos:</p>
            <ol style={{ fontSize: '.72rem', color: '#64748B', paddingLeft: 18, lineHeight: 2 }}>
              <li>Acesse <code style={{ color: '#F97316' }}>open.shopee.com.br</code> → Solicitar acesso de Partner</li>
              <li>Crie um app e adicione o Redirect URL: <code style={{ color: '#4ADE80' }}>https://entratta.com.br/api/auth/shopee</code></li>
              <li>Copie Partner ID e Partner Key para o <code>.env.local</code></li>
            </ol>
            <pre style={{ background: 'rgba(0,0,0,.4)', borderRadius: 6, padding: '8px 10px', fontSize: '.7rem', color: '#F97316', marginTop: 8 }}>
{`SHOPEE_PARTNER_ID=seu-partner-id
SHOPEE_PARTNER_KEY=sua-partner-key`}
            </pre>
          </div>

          <div style={{ background: 'rgba(0,0,0,.3)', borderRadius: 8, padding: '12px 14px' }}>
            <p style={{ fontSize: '.72rem', color: '#94A3B8', marginBottom: 6, fontWeight: 700 }}>Webhook (configurar no Shopee Open Platform):</p>
            <code style={{ display: 'block', color: '#4ADE80', fontSize: '.73rem', wordBreak: 'break-all' }}>
              https://entratta.com.br/api/webhooks/shopee
            </code>
            <p style={{ fontSize: '.68rem', color: '#2E4A6A', marginTop: 6 }}>Evento: <strong>ORDER_STATUS_UPDATE</strong></p>
          </div>
        </div>

        {/* Teste manual */}
        <div style={{ ...card, background: 'rgba(30,58,95,.1)', border: '1px solid rgba(30,58,95,.3)' }}>
          <span style={{ ...label, color: '#60A5FA' }}>🧪 Teste de notificação</span>
          <p style={{ fontSize: '.75rem', color: '#94A3B8', marginBottom: 12 }}>
            Simula um novo pedido e envia a mensagem de notificação no grupo do WhatsApp.
          </p>
          <TestNotificacao />
        </div>
      </div>
    </div>
  )
}

function TestNotificacao() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')

  async function testar() {
    setLoading(true)
    setResult('')
    try {
      const res = await fetch('/api/admin/test-notification', { method: 'POST' })
      const data = await res.json()
      setResult(data.ok ? '✓ Mensagem enviada no grupo!' : `Erro: ${data.error ?? 'verifique o .env.local'}`)
    } catch {
      setResult('Erro de rede')
    }
    setLoading(false)
  }

  return (
    <div>
      <button
        onClick={testar}
        disabled={loading}
        style={{ padding: '9px 20px', borderRadius: 8, border: '1px solid rgba(96,165,250,.4)', background: 'rgba(96,165,250,.1)', color: '#60A5FA', fontWeight: 700, fontSize: '.8rem', cursor: loading ? 'wait' : 'pointer' }}
      >
        {loading ? 'Enviando...' : 'Enviar notificação de teste'}
      </button>
      {result && (
        <div style={{ marginTop: 10, fontSize: '.78rem', color: result.startsWith('✓') ? '#22C55E' : '#EF4444', fontWeight: 600 }}>
          {result}
        </div>
      )}
    </div>
  )
}

export default function IntegracoesPainelPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#060E16' }} />}>
      <IntegracoesPainel />
    </Suspense>
  )
}
