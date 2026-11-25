import type { Coin, Prices } from '../data/coins'
import { CoinCard } from './CoinCard'

type Props = { coins: readonly Coin[]; prices: Prices }
export function CoinList({ coins, prices }: Props) {
  return <div className="coin-grid">{coins.map(coin => {
    const price = prices[coin.id]
    return price ? <CoinCard key={coin.id} coin={coin} price={price.usd} /> : null
  })}</div>
}
