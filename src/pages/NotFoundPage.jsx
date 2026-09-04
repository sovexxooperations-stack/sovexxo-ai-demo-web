import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main className="not-found-page">
      <div>
        <span className="eyebrow">SOVEXXO DEMO</span>
        <h1>Página não encontrada</h1>
        <p>A experiência que procura não está disponível neste endereço.</p>
        <Link to="/demo/prelada">Abrir demonstração</Link>
      </div>
    </main>
  )
}
