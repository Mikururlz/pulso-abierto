import { expect, it } from 'vitest'
import { formatPrice } from './coins'

it('conserva el formato de precios en USD con separadores argentinos y dos decimales', () => {
  expect(formatPrice(1234.5)).toBe('US$\u00a01.234,50')
  expect(formatPrice(0)).toBe('US$\u00a00,00')
})
