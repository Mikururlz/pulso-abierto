import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { CryptoId } from '../data/coins'

export const FAVORITES_KEY = 'pulso-abierto-favorites'

type FavoritesState = {
  favorites: CryptoId[]
  toggleFavorite: (id: CryptoId) => void
}

// Traza de desarrollo para comprobar el almacenamiento desde la consola.
// No se ejecuta en la compilación de producción ni registra precios o búsquedas.
function traceStorage(event: string) {
  if (import.meta.env.DEV) {
    console.debug(`[Pulso Abierto] ${event}: ${localStorage.getItem(FAVORITES_KEY)}`)
  }
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      favorites: [],
      toggleFavorite: (id) => {
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter((item) => item !== id)
            : [...state.favorites, id],
        }))
        traceStorage('favoritos guardados')
      },
    }),
    {
      name: FAVORITES_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ favorites: state.favorites }),
    },
  ),
)

traceStorage('favoritos recuperados al iniciar')
