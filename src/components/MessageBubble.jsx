const TOKEN_REGEX =
  /([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|\+?\d[\d\s().-]{7,}\d)/gi

function normalizePhone(value) {
  return value.replace(/[^\d+]/g, '')
}

function renderInlineLinks(line, lineKey) {
  const parts = line.split(TOKEN_REGEX)

  return parts.map((part, index) => {
    if (!part) return null

    if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(part)) {
      return (
        <a key={`${lineKey}-email-${index}`} href={`mailto:${part}`}>
          {part}
        </a>
      )
    }

    if (/^\+?\d[\d\s().-]{7,}\d$/.test(part)) {
      return (
        <a
          key={`${lineKey}-phone-${index}`}
          href={`tel:${normalizePhone(part)}`}
        >
          {part}
        </a>
      )
    }

    return <span key={`${lineKey}-text-${index}`}>{part}</span>
  })
}

function RichText({ text }) {
  const lines = text.split('\n')
  return lines.map((line, index) => (
    <span key={`line-${index}`}>
      {renderInlineLinks(line, index)}
      {index < lines.length - 1 ? <br /> : null}
    </span>
  ))
}

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`message-row ${isUser ? 'message-row-user' : ''}`}>
      <div
        className={`message-bubble ${
          isUser ? 'bubble-user' : 'bubble-assistant'
        }`}
      >
        <RichText text={message.content} />
      </div>
    </div>
  )
}
