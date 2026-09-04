import { ArrowUpRight } from 'lucide-react'

export default function SuggestedPrompts({ prompts, disabled, onSelect }) {
  return (
    <div className="suggested-prompts" aria-label="Sugestões para experimentar">
      {prompts.map((prompt) => (
        <button
          className="suggested-prompt"
          type="button"
          key={prompt}
          onClick={() => onSelect(prompt)}
          disabled={disabled}
        >
          <span>{prompt}</span>
          <ArrowUpRight size={16} aria-hidden="true" />
        </button>
      ))}
    </div>
  )
}
