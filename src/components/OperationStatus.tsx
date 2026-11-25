import type { Operation } from '../data/coins'

type Props = { operation: Operation; count?: number; onRetry: () => void }
export function OperationStatus({ operation, count = 0, onRetry }: Props) {
  let message: string
  switch (operation.status) {
    case 'initial': message = 'Todavía no hiciste una consulta. Consultá los precios cuando estés lista.'; break
    case 'loading': message = 'Consultando CoinGecko. Esto puede tardar unos segundos.'; break
    case 'error': message = `Error: ${operation.message}`; break
    case 'success': message = count === 0
      ? 'Sin resultados. No hay cotizaciones disponibles para estos criterios. Podés cambiar los filtros y consultar otra vez.'
      : `${count} ${count === 1 ? 'cotización disponible' : 'cotizaciones disponibles'}. Respuesta recibida: ${operation.receivedAt}.`; break
  }
  return <>
    <div className={`state-message ${operation.status === 'error' ? 'error-message' : operation.status === 'success' ? count ? 'success-message' : 'empty-message' : ''}`}
      role="status" aria-live="polite" aria-atomic="true">{message}</div>
    {operation.status === 'error' && <button type="button" className="button button-secondary retry" onClick={onRetry}>Volver a intentar</button>}
  </>
}
