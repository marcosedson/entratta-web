export function MercadoLivreIcon({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-label="Mercado Livre"
    >
      <rect width="48" height="48" rx="10" fill="#FFE600" />
      {/* Figura humana estilizada (ícone característico do ML) */}
      <circle cx="24" cy="14" r="5" fill="#3483FA" />
      <path
        d="M14 34c0-5.523 4.477-10 10-10s10 4.477 10 10"
        stroke="#3483FA"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Seta de compra */}
      <path
        d="M34 28l4 4-4 4"
        stroke="#3483FA"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}
