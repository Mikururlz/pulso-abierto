import { coins, type Prices } from './coins'
import type { Query } from '../validation/query'

// Función pura: calcula la vista sin alterar los precios ni crear otro estado.
export function selectCoins(prices: Prices, query: Query) {
  const term = query.text.toLowerCase()
  return coins.filter(coin => prices[coin.id] !== undefined
    && (query.selection === 'all' || query.selection === coin.id)
    && (coin.name.toLowerCase().includes(term) || coin.symbol.toLowerCase().includes(term)))
}
