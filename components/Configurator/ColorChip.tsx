'use client'

export function ColorChip({
  hex,
  label,
  active,
  onClick,
  isLight,
}: {
  hex: string
  label: string
  active: boolean
  onClick: () => void
  isLight?: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={onClick}
        title={label}
        className="w-8 h-8 rounded-full transition-all duration-150 flex-shrink-0"
        style={{
          background: hex,
          border: active
            ? '3px solid #22C55E'
            : isLight
            ? '2px solid #555'
            : '2px solid rgba(255,255,255,0.12)',
          transform: active ? 'scale(1.18)' : 'scale(1)',
          boxShadow: active ? '0 0 0 2px rgba(34,197,94,0.25)' : 'none',
        }}
      />
      <span
        style={{
          fontSize: '0.58rem',
          color: '#2E4A6A',
          textAlign: 'center',
          maxWidth: '36px',
          lineHeight: 1.2,
        }}
      >
        {label}
      </span>
    </div>
  )
}
