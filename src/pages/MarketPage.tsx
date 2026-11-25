import { useState } from 'react'
import { selectCoins } from '../data/selectCoins'
import { usePrices } from '../hooks/usePrices'
import type { Query } from '../validation/query'
import { QueryForm } from '../components/QueryForm'
import { CoinList } from '../components/CoinList'
import { OperationStatus } from '../components/OperationStatus'

export function MarketPage() {
  const { operation, load } = usePrices()
  const [query, setQuery] = useState<Query>({ text: '', selection: 'all' })
  const prices = operation.status === 'success' ? operation.prices : {}
  const visible = selectCoins(prices, query)

  return <>
    <section className="intro" aria-labelledby="page-title">
      <p className="eyebrow"><span aria-hidden="true">✳</span> DATOS DEL MERCADO</p>
      <h1 id="page-title">El pulso del mercado,<br /><span>en un solo lugar.</span></h1>
      <p className="intro-copy">Consultá las cotizaciones de Bitcoin, Ethereum y Solana, de forma simple y clara.</p>
    </section>
    <section className="market-panel" aria-labelledby="market-title">
      <div className="section-heading"><div><p className="eyebrow">MERCADO</p><h2 id="market-title">Cotizaciones</h2></div><span className="currency-badge">USD</span></div>
      <QueryForm loading={operation.status === 'loading'} onQuery={next => { setQuery(next); void load() }} />
      <div aria-busy={operation.status === 'loading'}>
        {operation.status === 'success' && <CoinList coins={visible} prices={prices} />}
      </div>
      <OperationStatus operation={operation} count={visible.length} onRetry={() => { void load() }} />
      <p className="source-note">Fuente: CoinGecko API · Precios en dólares estadounidenses. Las favoritas se conservan en este navegador.</p>
    </section>
  </>
}
