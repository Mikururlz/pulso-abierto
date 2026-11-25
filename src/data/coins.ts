export const coins = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', mark: '₿', color: 'orange', description: 'Bitcoin es una criptomoneda descentralizada que permite transferir valor entre personas sin una autoridad central.' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', mark: '◇', color: 'violet', description: 'Ethereum es una red que permite ejecutar contratos inteligentes. Ether es su criptomoneda nativa.' },
  { id: 'solana', name: 'Solana', symbol: 'SOL', mark: '≋', color: 'mint', description: 'Solana es una red orientada a aplicaciones descentralizadas. SOL es la criptomoneda utilizada para pagar sus operaciones.' },
] as const

export type Coin = (typeof coins)[number]
export type CryptoId = Coin['id']
export type Prices = Partial<Record<CryptoId, { usd: number }>>
export type Operation =
  | { status: 'initial' }
  | { status: 'loading' }
  | { status: 'success'; prices: Prices; receivedAt: string }
  | { status: 'error'; message: string }

const priceFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency', currency: 'USD', maximumFractionDigits: 2,
})

export const formatPrice = (value: number) => priceFormatter.format(value)
