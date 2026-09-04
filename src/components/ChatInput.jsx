import { RotateCcw, Send } from 'lucide-react'
import { useState } from 'react'
import { MAX_MESSAGE_LENGTH } from '../config.js'

export default function ChatInput({
  placeholder,
  resetLabel,
  sending,
  sampleNotice,
  onSend,
  onReset,
}) {
  const [value, setValue] = useState('')

  const submit = () => {
    const message = value.trim()
    if (!message || sending) return
    onSend(message)
    setValue('')
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      submit()
    }
  }

  return (
    <div className="chat-input-shell">
      <div className="input-toolbar">
        <p>{sampleNotice}</p>
        <button
          className="reset-button"
          type="button"
          onClick={onReset}
          disabled={sending}
        >
          <RotateCcw size={14} />
          {resetLabel}
        </button>
      </div>

      <div className="composer">
        <textarea
          aria-label={placeholder}
          value={value}
          placeholder={placeholder}
          maxLength={MAX_MESSAGE_LENGTH}
          disabled={sending}
          rows={1}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
        />

        <div className="composer-actions">
          {value.length >= 1600 ? (
            <span className="char-counter">
              {value.length}/{MAX_MESSAGE_LENGTH}
            </span>
          ) : (
            <span />
          )}

          <button
            className="send-button"
            type="button"
            aria-label="Enviar mensagem"
            disabled={sending || value.trim().length === 0}
            onClick={submit}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
