import { describe, expect, it, vi } from 'vitest'
import { fetchPrices } from './prices'

describe('servicio de precios', () => {
  it('devuelve precios tipados de una respuesta exitosa y omite campos externos', async () => {
    const request = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      bitcoin: { usd: 100, extra: 'no usado' }, ethereum: { usd: 0 },
      solana: { usd: 20 }, otra: { usd: 1 },
    }), { status: 200 }))
    vi.stubGlobal('fetch', request)
    const signal = new AbortController().signal
    await expect(fetchPrices(signal)).resolves.toEqual({
      bitcoin: { usd: 100 }, ethereum: { usd: 0 }, solana: { usd: 20 },
    })
    expect(request).toHaveBeenCalledWith(expect.stringContaining('api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd'), { signal })
  })

  it('rechaza una respuesta HTTP no exitosa antes de procesar JSON', async () => {
    const json = vi.fn()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 503, json }))
    await expect(fetchPrices(new AbortController().signal)).rejects.toThrow('estado 503')
    expect(json).not.toHaveBeenCalled()
  })

  it('permite una respuesta sin cotizaciones y rechaza precios inválidos', async () => {
    const request = vi.fn().mockResolvedValueOnce(new Response('{}'))
      .mockResolvedValueOnce(new Response('{"bitcoin":{"usd":-1}}'))
    vi.stubGlobal('fetch', request)
    await expect(fetchPrices(new AbortController().signal)).resolves.toEqual({})
    await expect(fetchPrices(new AbortController().signal)).rejects.toThrow('cotización de Bitcoin')
  })
})
