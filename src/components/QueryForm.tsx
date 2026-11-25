import { useState, type FormEvent } from 'react'
import { querySchema, type Query } from '../validation/query'

type Props = { loading: boolean; onQuery: (query: Query) => void }

export function QueryForm({ loading, onQuery }: Props) {
  const [text, setText] = useState('')
  const [selection, setSelection] = useState('all')
  const [errors, setErrors] = useState<{ text?: string; selection?: string }>({})

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = querySchema.safeParse({ text, selection })
    if (!result.success) {
      const next: typeof errors = {}
      for (const issue of result.error.issues) {
        if (issue.path[0] === 'text') next.text = issue.message
        if (issue.path[0] === 'selection') next.selection = issue.message
      }
      setErrors(next)
      return
    }
    setErrors({})
    setText(result.data.text)
    onQuery(result.data)
  }

  return <form onSubmit={submit} noValidate className="query-form">
    <div className="fields">
      <div className="field">
        <label htmlFor="search">Buscar por nombre o símbolo</label>
        <input id="search" type="search" value={text} onChange={e => setText(e.target.value)}
          placeholder="Ej.: Bitcoin o BTC" aria-invalid={Boolean(errors.text)}
          aria-describedby={`search-help${errors.text ? ' search-error' : ''}`} />
        <small id="search-help">Vacío: todas. Si escribís, usá de 2 a 40 caracteres.</small>
        {errors.text && <p id="search-error" className="field-error" role="alert">Error: {errors.text}</p>}
      </div>
      <div className="field">
        <label htmlFor="selection">Criptomoneda</label>
        <select id="selection" value={selection} onChange={e => setSelection(e.target.value)}
          aria-invalid={Boolean(errors.selection)} aria-describedby={errors.selection ? 'selection-error' : undefined}>
          <option value="all">Todas las criptomonedas</option>
          <option value="bitcoin">Bitcoin</option><option value="ethereum">Ethereum</option><option value="solana">Solana</option>
        </select>
        {errors.selection && <p id="selection-error" className="field-error" role="alert">Error: {errors.selection}</p>}
      </div>
    </div>
    <button className="button button-primary" type="submit" disabled={loading}>
      {loading ? <><span className="spinner" aria-hidden="true" />Consultando…</> : 'Consultar cotizaciones'}
    </button>
  </form>
}
