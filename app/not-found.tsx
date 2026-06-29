import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Página não encontrada | Entratta',
  description: 'A página que você procura não existe. Redirecionando para a home...',
}

export default function NotFound() {
  redirect('/')
}
