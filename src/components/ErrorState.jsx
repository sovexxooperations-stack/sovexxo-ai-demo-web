import { CircleAlert, RefreshCw } from 'lucide-react'

const COPY = {
  DEMO_NOT_FOUND: {
    title: 'Demonstração não encontrada',
    body: 'Esta demonstração não está disponível.',
  },
  CONFIG_UNAVAILABLE: {
    title: 'Demonstração temporariamente indisponível',
    body: 'Não foi possível carregar a configuração. Tente novamente dentro de momentos.',
  },
  INVALID_CONFIG_RESPONSE: {
    title: 'Demonstração temporariamente indisponível',
    body: 'Não foi possível carregar a experiência de forma segura.',
  },
}

export default function ErrorState({ code, onRetry }) {
  const copy = COPY[code] ?? COPY.CONFIG_UNAVAILABLE

  return (
    <div className="error-state">
      <div className="error-icon">
        <CircleAlert size={24} />
      </div>
      <h2>{copy.title}</h2>
      <p>{copy.body}</p>
      {onRetry ? (
        <button type="button" onClick={onRetry}>
          <RefreshCw size={16} />
          Tentar novamente
        </button>
      ) : null}
    </div>
  )
}
