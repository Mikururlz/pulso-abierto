import { z } from 'zod'

export const querySchema = z.object({
  text: z.string().trim().max(40, 'Usá hasta 40 caracteres.')
    .refine(value => value.length === 0 || value.length >= 2,
      'Ingresá al menos 2 caracteres o dejá el campo vacío para ver todas.'),
  selection: z.enum(['all', 'bitcoin', 'ethereum', 'solana'], {
    error: 'Elegí una criptomoneda de la lista.',
  }),
})
export type Query = z.infer<typeof querySchema>
