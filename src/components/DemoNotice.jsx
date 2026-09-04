import { ShieldCheck } from 'lucide-react'

export default function DemoNotice({ disclaimer }) {
  return (
    <aside className="demo-notice">
      <ShieldCheck size={18} aria-hidden="true" />
      <div>
        <strong>Ambiente seguro de demonstração</strong>
        <p>{disclaimer}</p>
      </div>
    </aside>
  )
}
