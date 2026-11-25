import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import App from '../App'
import { FAVORITES_KEY, useFavoritesStore } from '../store/favorites'

const prices = { bitcoin: { usd: 100 }, ethereum: { usd: 200 }, solana: { usd: 30 } }
const response = () => new Response(JSON.stringify(prices), { status: 200 })

function openApp(path = '/') {
  return render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>)
}

describe('recorridos de Pulso Abierto', () => {
  it('anuncia carga y luego muestra las tres cotizaciones', async () => {
    let resolve!: (response: Response) => void
    vi.stubGlobal('fetch', vi.fn(() => new Promise<Response>(done => { resolve = done })))
    const user = userEvent.setup()
    openApp()
    expect(screen.getByRole('status')).toHaveTextContent('Todavía no hiciste')
    await user.click(screen.getByRole('button', { name: 'Consultar cotizaciones' }))
    expect(screen.getByRole('status')).toHaveTextContent('Consultando CoinGecko')
    expect(screen.getByRole('button', { name: 'Consultando…' })).toBeDisabled()
    await act(async () => { resolve(response()) })
    expect(await screen.findByRole('link', { name: /^Bitcoin$/ })).toBeVisible()
    expect(screen.getAllByRole('article')).toHaveLength(3)
    expect(screen.getByRole('status')).toHaveTextContent('3 cotizaciones disponibles')
  })

  it('comparte las favoritas entre listado y detalle, actualiza el contador y permite desmarcar', async () => {
    vi.stubGlobal('fetch', vi.fn().mockImplementation(async () => response()))
    const user = userEvent.setup()
    openApp()
    await user.click(screen.getByRole('button', { name: 'Consultar cotizaciones' }))
    await user.click(await screen.findByRole('button', { name: 'Marcar Bitcoin como favorita' }))
    expect(screen.getByRole('button', { name: 'Quitar Bitcoin de favorita' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('Favoritas: 1')).toBeVisible()
    await user.click(screen.getByRole('link', { name: /^Bitcoin$/ }))
    expect(await screen.findByRole('heading', { name: 'Bitcoin BTC' })).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Quitar Bitcoin de favorita' }))
    expect(screen.getByRole('button', { name: 'Marcar Bitcoin como favorita' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByText('Favoritas: 0')).toBeVisible()
    await user.click(screen.getByRole('link', { name: /Volver a cotizaciones/ }))
    await user.click(screen.getByRole('button', { name: 'Consultar cotizaciones' }))
    expect(await screen.findByRole('button', { name: 'Marcar Bitcoin como favorita' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('recupera la selección persistida, y también conserva su eliminación', async () => {
    vi.stubGlobal('fetch', vi.fn().mockImplementation(async () => response()))
    const user = userEvent.setup()
    const view = openApp('/criptomonedas/bitcoin')
    await user.click(screen.getByRole('button', { name: 'Marcar Bitcoin como favorita' }))
    const saved = localStorage.getItem(FAVORITES_KEY)!
    expect(JSON.parse(saved).state).toEqual({ favorites: ['bitcoin'] })
    view.unmount()

    // Simula un arranque nuevo: memoria vacía, almacenamiento previo y rehidratación.
    act(() => { useFavoritesStore.setState({ favorites: [] }) })
    localStorage.setItem(FAVORITES_KEY, saved)
    await act(async () => { await useFavoritesStore.persist.rehydrate() })
    const next = openApp('/criptomonedas/bitcoin')
    await user.click(screen.getByRole('button', { name: 'Quitar Bitcoin de favorita' }))
    const removed = localStorage.getItem(FAVORITES_KEY)!
    expect(JSON.parse(removed).state).toEqual({ favorites: [] })
    next.unmount()
    act(() => { useFavoritesStore.setState({ favorites: ['bitcoin'] }) })
    localStorage.setItem(FAVORITES_KEY, removed)
    await act(async () => { await useFavoritesStore.persist.rehydrate() })
    openApp('/criptomonedas/bitcoin')
    expect(screen.getByRole('button', { name: 'Marcar Bitcoin como favorita' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('comunica un error y se recupera al reintentar sin persistir carga ni error', async () => {
    const request = vi.fn().mockResolvedValueOnce(new Response('{}', { status: 503 }))
      .mockResolvedValueOnce(response())
    vi.stubGlobal('fetch', request)
    const user = userEvent.setup()
    openApp()
    await user.click(screen.getByRole('button', { name: 'Consultar cotizaciones' }))
    expect(await screen.findByRole('button', { name: 'Volver a intentar' })).toBeVisible()
    expect(screen.getByRole('status')).toHaveTextContent('CoinGecko respondió con el estado 503')
    expect(JSON.parse(localStorage.getItem(FAVORITES_KEY)!).state).toEqual({ favorites: [] })
    await user.click(screen.getByRole('button', { name: 'Volver a intentar' }))
    expect(await screen.findByRole('link', { name: /^Bitcoin$/ })).toBeVisible()
    expect(request).toHaveBeenCalledTimes(2)
  })

  it('muestra ausencia de datos sin inventar cotizaciones', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}')))
    const user = userEvent.setup()
    openApp()
    await user.click(screen.getByRole('button', { name: 'Consultar cotizaciones' }))
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Sin resultados'))
    expect(screen.queryAllByRole('article')).toHaveLength(0)
  })

  it('bloquea el formulario inválido y combina búsqueda con selección', async () => {
    const request = vi.fn().mockImplementation(async () => response())
    vi.stubGlobal('fetch', request)
    const user = userEvent.setup()
    openApp()
    const search = screen.getByRole('searchbox', { name: 'Buscar por nombre o símbolo' })
    await user.type(search, 'x')
    await user.click(screen.getByRole('button', { name: 'Consultar cotizaciones' }))
    expect(screen.getByRole('alert')).toHaveTextContent('al menos 2 caracteres')
    expect(request).not.toHaveBeenCalled()
    await user.clear(search)
    await user.type(search, 'BTC')
    await user.selectOptions(screen.getByRole('combobox', { name: 'Criptomoneda' }), 'ethereum')
    await user.click(screen.getByRole('button', { name: 'Consultar cotizaciones' }))
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Sin resultados'))
  })
})
