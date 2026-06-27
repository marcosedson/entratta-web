export function ShopeeIcon({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-label="Shopee"
    >
      <rect width="48" height="48" rx="10" fill="#EE4D2D" />
      {/* Sacola de compras Shopee */}
      <path
        d="M16 21h16l-2.5 13H18.5L16 21z"
        fill="white"
        fillOpacity="0.95"
      />
      {/* Alças da sacola */}
      <path
        d="M20 21c0-2.21 1.79-4 4-4s4 1.79 4 4"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Sorriso característico do Shopee */}
      <path
        d="M20.5 29c0 2 7 2 7 0"
        stroke="#EE4D2D"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}
