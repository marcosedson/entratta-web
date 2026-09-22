import { MAX_GUIDE_WIDTH_CM } from '@/lib/constants'

interface SizeShapeProps {
  widthCm: number
  heightCm: number
  active?: boolean
}

export function SizeShape({ widthCm, heightCm, active = false }: SizeShapeProps) {
  return (
    <div className="flex items-end justify-center w-16 h-12 shrink-0" aria-hidden="true">
      <div
        className="rounded-[3px]"
        style={{
          width: `${(widthCm / MAX_GUIDE_WIDTH_CM) * 100}%`,
          aspectRatio: `${widthCm} / ${heightCm}`,
          background: active ? '#22C55E' : '#CBD5E1',
        }}
      />
    </div>
  )
}
