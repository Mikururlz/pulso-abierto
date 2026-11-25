import { Link } from 'react-router'
export function NotFoundPage() {
  return <section className="intro"><p className="eyebrow">ERROR 404</p><h1>Página inexistente</h1>
    <p className="intro-copy">La dirección que ingresaste no corresponde a una página de Pulso Abierto.</p>
    <Link className="back-link" to="/">Volver a cotizaciones</Link></section>
}
