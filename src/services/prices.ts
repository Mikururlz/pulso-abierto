import { coins, type Prices } from '../data/coins'

const apiUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

// Conserva la validación del prototipo: un dato faltante no se inventa.
export function parsePrices(value: unknown): Prices {
  if (!isRecord(value)) throw new Error('CoinGecko devolvió un formato inesperado.')
  const prices: Prices = {}
  for (const coin of coins) {
    const raw = value[coin.id]
    if (raw === undefined) continue
    if (!isRecord(raw) || typeof raw.usd !== 'number' || !Number.isFinite(raw.usd) || raw.usd < 0) {
      throw new Error(`No se pudo interpretar la cotización de ${coin.name}.`)
    }
    prices[coin.id] = { usd: raw.usd }
  }
  return prices
}

export async function fetchPrices(signal: AbortSignal): Promise<Prices> {
  const response = await fetch(apiUrl, { signal })
  if (!response.ok) {
    throw new Error(response.status === 429
      ? 'CoinGecko limitó temporalmente las consultas. Esperá un momento y volvé a intentar.'
      : `CoinGecko respondió con el estado ${response.status}. Intentá nuevamente.`)
  }
  const data: unknown = await response.json()
  return parsePrices(data)
}
