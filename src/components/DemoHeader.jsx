import { MapPin, MessageSquare } from 'lucide-react'

export default function DemoHeader({ clinic, badge }) {
  return (
    <header className="demo-header">
      <div className="header-identity">
        <span className="clinic-mark" aria-hidden="true">
          <MessageSquare size={17} strokeWidth={1.8} />
        </span>

        <div className="clinic-heading">
          <div className="heading-row">
            <h1>{clinic.name}</h1>
            <span className="demo-badge">{badge}</span>
          </div>

          <div className="clinic-meta">
            <span>
              <MapPin size={13} strokeWidth={1.9} aria-hidden="true" />
              {clinic.primary_location}
            </span>
            <span className="status-dot-wrap">
              <span className="status-dot" aria-hidden="true" />
              Ambiente de demonstração
            </span>
          </div>
        </div>
      </div>

      <p className="sovexxo-credit">
        <span className="sovexxo-credit-label">Experiência demonstrativa por</span>
        <span className="sovexxo-credit-name">Sovexxo</span>
      </p>
    </header>
  )
}
