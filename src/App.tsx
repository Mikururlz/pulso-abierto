import { Link, Route, Routes } from 'react-router'
import { MarketPage } from './pages/MarketPage'
import { DetailPage } from './pages/DetailPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { useFavoritesStore } from './store/favorites'

export default function App() {
  const favoriteCount = useFavoritesStore((state) => state.favorites.length)
  return <div className="page-shell">
    <a className="skip-link" href="#contenido">Saltar al contenido</a>
    <header className="site-header">
      <Link className="brand" to="/" aria-label="Pulso Abierto, ir al inicio">
        <span className="brand-mark" aria-hidden="true"><span /><span /><span /><span /></span>
        <span>Pulso <strong>Abierto</strong></span>
      </Link>
      <span className="header-note" aria-live="polite"><span className="live-dot" aria-hidden="true" />Favoritas: {favoriteCount}</span>
    </header>
    <main id="contenido" tabIndex={-1}>
      <Routes><Route path="/" element={<MarketPage />} />
        <Route path="/criptomonedas/:id" element={<DetailPage />} />
        <Route path="*" element={<NotFoundPage />} /></Routes>
    </main>
    <footer className="site-footer"><span>Pulso Abierto</span><span>Información de mercado para aprender y explorar.</span></footer>
  </div>
}
