export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-white mb-4 tracking-tight">
            Entratta
          </h1>
          <div className="h-1 w-24 bg-blue-500 mx-auto rounded-full"></div>
        </div>
        <p className="text-xl text-slate-300 mb-4 leading-relaxed">
          Soluções inteligentes para conectar empresas e clientes.
        </p>
        <p className="text-slate-400 mb-10">
          CRM, automação e comunicação omnichannel em uma única plataforma.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://crm.entratta.com.br"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Acessar CRM
          </a>
          <a
            href="mailto:contato@entratta.com.br"
            className="px-8 py-3 border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Entre em contato
          </a>
        </div>
      </div>
      <footer className="absolute bottom-6 text-slate-600 text-sm">
        © 2026 Entratta. Todos os direitos reservados.
      </footer>
    </main>
  );
}
