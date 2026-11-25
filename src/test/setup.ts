import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'
import { useFavoritesStore } from '../store/favorites'

beforeEach(() => {
  localStorage.clear()
  useFavoritesStore.setState({ favorites: [] })
  // Ninguna prueba puede salir a la red si se olvida de simular fetch.
  vi.stubGlobal('fetch', vi.fn(() => { throw new Error('Solicitud real prohibida en las pruebas') }))
})

afterEach(() => {
  cleanup()
  localStorage.clear()
  vi.unstubAllGlobals()
})
