import type { Coin } from '../data/coins'
import { useFavoritesStore } from '../store/favorites'

export function FavoriteButton({ coin }: { coin: Coin }) {
  const favorite = useFavoritesStore((state) => state.favorites.includes(coin.id))
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite)

  return <button type="button" className="favorite" aria-pressed={favorite}
    aria-label={`${favorite ? 'Quitar' : 'Marcar'} ${coin.name} ${favorite ? 'de' : 'como'} favorita`}
    onClick={() => toggleFavorite(coin.id)}>
    <span aria-hidden="true">{favorite ? '★' : '☆'}</span> {favorite ? 'Favorita' : 'Marcar'}
  </button>
}
