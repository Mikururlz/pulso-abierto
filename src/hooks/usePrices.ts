import { useCallback, useEffect, useRef, useState } from 'react'
import type { Operation } from '../data/coins'
import { fetchPrices } from '../services/prices'

export function usePrices() {
  const [operation, setOperation] = useState<Operation>({ status: 'initial' })
  const active = useRef<AbortController | null>(null)

  useEffect(() => () => { active.current?.abort() }, [])

  const load = useCallback(async () => {
    active.current?.abort()
    const controller = new AbortController()
    active.current = controller
    setOperation({ status: 'loading' })
    try {
      const prices = await fetchPrices(controller.signal)
      if (controller.signal.aborted) return
      setOperation({ status: 'success', prices, receivedAt: new Date().toLocaleString('es-AR') })
    } catch (error: unknown) {
      if (controller.signal.aborted) return
      const message = error instanceof TypeError
        ? 'No se pudo conectar con CoinGecko. Revisá tu conexión y volvé a intentar.'
        : error instanceof SyntaxError
          ? 'La respuesta de CoinGecko no se pudo leer. Volvé a intentar.'
          : error instanceof Error ? error.message : 'Ocurrió un error inesperado. Volvé a intentar.'
      setOperation({ status: 'error', message })
    }
  }, [])

  return { operation, load }
}
