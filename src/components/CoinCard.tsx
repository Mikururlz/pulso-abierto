import { Link } from 'react-router'
import { formatPrice, type Coin } from '../data/coins'
import { FavoriteButton } from './FavoriteButton'

type Props = { coin: Coin; price: number }
export function CoinCard({ coin, price }: Props) {
  return <article className="coin-card">
    <div className="coin-info">
      <span className={`coin-icon ${coin.color}`} aria-hidden="true">{coin.mark}</span>
      <div><h3><Link to={`/criptomonedas/${coin.id}`}>{coin.name}</Link></h3><p>{coin.symbol}</p></div>
    </div>
    <div className="coin-values"><p className="coin-price">{formatPrice(price)}</p>
      <FavoriteButton coin={coin} />
    </div>
  </article>
}
