import { NextRequest } from 'next/server'

/** Auth simples do painel interno: header x-admin-password === ADMIN_PASSWORD. */
export function isAdminAuthorized(request: NextRequest): boolean {
  const senha = request.headers.get('x-admin-password')
  const esperada = process.env.ADMIN_PASSWORD
  return Boolean(esperada) && senha === esperada
}
