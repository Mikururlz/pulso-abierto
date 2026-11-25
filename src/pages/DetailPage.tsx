import { useEffect } from 'react'
import { Link, useParams } from 'react-router'
import { coins, formatPrice } from '../data/coins'
import { usePrices } from '../hooks/usePrices'
import { OperationStatus } from '../components/OperationStatus'
import { FavoriteButton } from '../components/FavoriteButton'

export function DetailPage() {
  const { id } = useParams<{ id: string }>()
  const coin = coins.find(item => item.id === id)
  const { operation, load } = usePrices()
  useEffect(() => { if (coin) void load() }, [coin, load])

  if (!coin) return <section className="intro"><h1>Criptomoneda inexistente</h1>
    <p className="intro-copy">El identificador solicitado no corresponde a Bitcoin, Ethereum ni Solana.</p>
    <Link className="back-link" to="/">Volver a cotizaciones</Link></section>

  const price = operation.status === 'success' ? operation.prices[coin.id] : undefined
  return <>
    <Link className="back-link" to="/">← Volver a cotizaciones</Link>
    <section className="market-panel detail" aria-labelledby="detail-title">
      <p className="eyebrow">DETALLE DE CRIPTOMONEDA</p>
      <span className={`coin-icon ${coin.color}`} aria-hidden="true">{coin.mark}</span>
      <h1 id="detail-title">{coin.name} <span>{coin.symbol}</span></h1>
      <p>{coin.description}</p>
      <FavoriteButton coin={coin} />
      <div aria-busy={operation.status === 'loading'}>
        {price && <><h2>Cotización en USD</h2><p className="detail-price">{formatPrice(price.usd)}</p></>}
      </div>
      <OperationStatus operation={operation} count={price ? 1 : 0} onRetry={() => { void load() }} />
      {operation.status === 'success' && <button type="button" className="button button-primary retry" onClick={() => { void load() }}>Actualizar cotización</button>}
      <p className="source-note">Fuente: CoinGecko API. La hora indica la recepción de la respuesta, no la hora de una operación del mercado.</p>
    </section>
  </>
}
