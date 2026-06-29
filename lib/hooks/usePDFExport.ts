import { useState, useCallback } from 'react'
import { ConfiguratorState } from './useConfigurator'
import { PDFService } from '@/lib/services'

export function usePDFExport() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generatePDF = useCallback(
    async (state: ConfiguratorState, svgPreview: string) => {
      setIsLoading(true)
      setError(null)

      try {
        await PDFService.generateAndDownloadPDF(
          state,
          svgPreview,
          'layout-tapete.pdf'
        )
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao gerar PDF'
        setError(message)
        console.error('PDF export error:', err)
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  return {
    generatePDF,
    isLoading,
    error,
  }
}
