'use client'

import { useRef, useState, useCallback } from 'react'

export function MagneticWrap({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [active, setActive] = useState(false)

  const handleMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setPos({
      x: (e.clientX - (r.left + r.width / 2)) * 0.28,
      y: (e.clientY - (r.top + r.height / 2)) * 0.28,
    })
  }, [])

  return (
    <div
      ref={ref}
      onMouseEnter={() => setActive(true)}
      onMouseMove={handleMove}
      onMouseLeave={() => {
        setActive(false)
        setPos({ x: 0, y: 0 })
      }}
      style={{ display: 'inline-flex' }}
    >
      <div
        style={{
          transform: `translate(${pos.x}px, ${pos.y}px)`,
          transition: active
            ? 'transform 0.12s ease'
            : 'transform 0.55s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        {children}
      </div>
    </div>
  )
}
