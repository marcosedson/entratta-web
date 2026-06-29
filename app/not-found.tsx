export const metadata = {
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>404 - Página não encontrada</h1>
      <p>A página que você procura não existe.</p>
      <a href="/">Voltar à home</a>
    </div>
  )
}
