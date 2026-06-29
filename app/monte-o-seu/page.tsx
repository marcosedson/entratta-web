import { redirect } from 'next/navigation'

export default function ConfiguradorPage() {
  // Configurador em desenvolvimento - não disponível em produção
  // Deixar comentado localmente para refinamento
  // TODO: Ativar quando pronto para produção
  redirect('/')
}
