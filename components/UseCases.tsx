const CASES = [
  {
    segment: 'Clínicas e Consultórios',
    headline: 'Transmita higiene e profissionalismo desde a entrada',
    desc: 'Um capacho com a logo da clínica comunica cuidado e atenção aos detalhes — exatamente o que seus pacientes esperam ver.',
    keywords: ['clínica médica', 'consultório', 'odontologia', 'psicologia'],
  },
  {
    segment: 'Academias e Studios',
    headline: 'Identidade visual forte que motiva desde o primeiro passo',
    desc: 'Nome, logo e slogan na entrada criam pertencimento e reforçam a marca para cada aluno que chega.',
    keywords: ['academia', 'crossfit', 'pilates', 'studio'],
  },
  {
    segment: 'Escritórios e Coworkings',
    headline: 'Primeira impressão corporativa que fecha negócios',
    desc: 'Visitantes, clientes e parceiros percebem profissionalismo antes mesmo de sentar à mesa de reunião.',
    keywords: ['escritório', 'coworking', 'sala comercial', 'sede'],
  },
  {
    segment: 'Comércios e Lojas',
    headline: 'Marketing no chão que converte em vendas',
    desc: 'Capacho personalizado na entrada da loja reforça a marca, gera reconhecimento e aumenta o ticket médio.',
    keywords: ['loja', 'varejo', 'restaurante', 'farmácia'],
  },
  {
    segment: 'Casa e Apartamento',
    headline: '"Bem-vindo" com a personalidade do seu lar',
    desc: 'Nome da família, frase inspiradora ou arte exclusiva na entrada de casa. Durável, fácil de limpar e design premium que todos vão notar.',
    keywords: ['capacho residencial', 'tapete para casa', 'bem-vindo', 'apartamento'],
  },
  {
    segment: 'Presentes e Eventos',
    headline: 'O presente que ninguém esquece — e que tem uso todo dia',
    desc: 'Capacho personalizado com o nome do casal, data especial ou frase exclusiva. Perfeito para casamento, mudança, chá de casa nova ou aniversário.',
    keywords: ['presente de casamento', 'chá de casa nova', 'presente personalizado', 'bodas'],
  },
]

export function UseCases() {
  return (
    <section className="px-4 py-20 md:py-28" style={{ background: '#0B1520' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4"
            style={{
              background: 'rgba(34,197,94,0.08)',
              border: '1px solid rgba(34,197,94,0.2)',
              color: '#22C55E',
              letterSpacing: '1.5px',
            }}
          >
            PARA QUEM É
          </span>
          <h2
            className="section-title-glow"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              color: '#fff',
              letterSpacing: 0,
            }}
          >
            Para qualquer entrada —{' '}
            <span style={{ color: '#4ADE80', fontStyle: 'italic' }}>empresa ou residência</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CASES.map(({ segment, headline, desc, keywords }) => (
            <article
              key={segment}
              className="rounded-2xl p-7"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <div className="mb-4">
                <span style={{ color: '#22C55E', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1.5px' }}>
                  {segment.toUpperCase()}
                </span>
              </div>
              <h3 className="text-white font-bold text-base mb-2">{headline}</h3>
              <p style={{ color: '#94A3B8', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '16px' }}>
                {desc}
              </p>
              <div className="flex flex-wrap gap-2">
                {keywords.map(kw => (
                  <span
                    key={kw}
                    className="px-2 py-0.5 rounded text-xs font-medium"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: '#64748B',
                    }}
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
