'use client'
import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/Header'

const Configurador = dynamic(() => import('./Configurador'), { ssr: false })

function ConfiguradorWithParams() {
  const params = useSearchParams()
  return (
    <Configurador
      lockedTamanho={params.get('tamanho') ?? undefined}
      lockedCor={params.get('cor') ?? undefined}
      pedidoInicial={params.get('pedido') ?? undefined}
      canal={(params.get('canal') ?? undefined) as 'ml' | 'shopee' | undefined}
    />
  )
}

export default function ConfiguradorPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<div style={{ minHeight: 'calc(100vh - 64px)', background: '#F1F5F9' }} />}>
        <ConfiguradorWithParams />
      </Suspense>
    </>
  )
}
