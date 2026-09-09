/**
 * Hash canônico do design: sha256 do JSON.stringify do objeto de design
 * EXATAMENTE como enviado ao preview. Gate de aprovação: o pedido só é aceito
 * se o design recebido bater com o hash da prévia gerada pelo cliente.
 * Web Crypto — funciona no browser e no Node.
 */
export async function hashDesign(design: unknown): Promise<string> {
  const data = new TextEncoder().encode(JSON.stringify(design))
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}
