'use client'
import { useEffect, useRef } from 'react'

const STEP_DIST   = 72    // px acumulados antes de plantar o próximo pé
const FADE_MS     = 2600  // duração do fade de cada pegada
const FH          = 48    // altura do pé em px de canvas
const FW          = 28    // largura do pé em px de canvas
const SIDE_OFFSET = 17    // px de afastamento de cada pé do centro da trajetória

type Side = 'L' | 'R'
interface Step { id: number; x: number; y: number; side: Side; angle: number; born: number }

function drawFoot(ctx: CanvasRenderingContext2D, s: Step, alpha: number) {
  const m = s.side === 'L' ? -1 : 1   // espelha para o pé esquerdo
  ctx.save()
  ctx.translate(s.x, s.y)
  ctx.rotate(s.angle)
  ctx.globalAlpha = alpha
  ctx.fillStyle = 'rgba(34,197,94,1)'

  // Calcanhar
  ctx.beginPath()
  ctx.ellipse(0, FH * 0.30, FW * 0.44, FH * 0.22, 0, 0, Math.PI * 2)
  ctx.fill()

  // Arco plantar (ponte entre calcanhar e metatarso)
  ctx.beginPath()
  ctx.ellipse(m * FW * 0.06, FH * 0.08, FW * 0.30, FH * 0.20, 0, 0, Math.PI * 2)
  ctx.fill()

  // Metatarso (bola do pé)
  ctx.beginPath()
  ctx.ellipse(0, -FH * 0.10, FW * 0.47, FH * 0.20, 0, 0, Math.PI * 2)
  ctx.fill()

  // Dedos: hallux → mindinho
  const toes: [number, number, number][] = [
    [-0.26, -0.46, 0.22],
    [-0.08, -0.51, 0.185],
    [ 0.08, -0.51, 0.160],
    [ 0.24, -0.48, 0.140],
    [ 0.37, -0.42, 0.115],
  ]
  for (const [ox, oy, r] of toes) {
    ctx.beginPath()
    ctx.arc(m * ox * FW, oy * FH, r * FW, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.restore()
}

export function FootstepCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Só ativa em dispositivos com mouse real (não touch)
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    let steps: Step[] = []
    let prevX = -9999, prevY = -9999
    let side: Side = 'R'
    let uid = 0
    let raf = 0

    const onMove = (e: MouseEvent) => {
      if (prevX === -9999) { prevX = e.clientX; prevY = e.clientY; return }

      const dx = e.clientX - prevX
      const dy = e.clientY - prevY
      if (Math.hypot(dx, dy) < STEP_DIST) return

      const moveAngle = Math.atan2(dy, dx)
      const footAngle = moveAngle + Math.PI / 2

      // Pé direito: perpendicular à direita da trajetória; esquerdo: à esquerda
      const perpAngle = side === 'R' ? moveAngle + Math.PI / 2 : moveAngle - Math.PI / 2
      const offX = Math.cos(perpAngle) * SIDE_OFFSET
      const offY = Math.sin(perpAngle) * SIDE_OFFSET

      steps.push({
        id: uid++,
        x: e.clientX + offX,
        y: e.clientY + offY,
        side,
        angle: footAngle,
        born: Date.now(),
      })

      side = side === 'L' ? 'R' : 'L'
      prevX = e.clientX
      prevY = e.clientY
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const now = Date.now()
      steps = steps.filter(s => now - s.born < FADE_MS)

      for (const step of steps) {
        const t = (now - step.born) / FADE_MS
        const alpha = Math.pow(1 - t, 1.9) * 0.30   // aparece rápido, some suave
        drawFoot(ctx, step, alpha)
      }

      raf = requestAnimationFrame(draw)
    }

    window.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9998 }}
      aria-hidden="true"
    />
  )
}
