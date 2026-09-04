import { useEffect, useMemo, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Bot, LockKeyhole } from 'lucide-react'
import ChatInput from '../components/ChatInput.jsx'
import DemoHeader from '../components/DemoHeader.jsx'
import DemoNotice from '../components/DemoNotice.jsx'
import ErrorState from '../components/ErrorState.jsx'
import MessageBubble from '../components/MessageBubble.jsx'
import SuggestedPrompts from '../components/SuggestedPrompts.jsx'
import { useDemoSession } from '../hooks/useDemoSession.js'

const RUNTIME_ERRORS = {
  INVALID_REQUEST:
    'Não foi possível processar a mensagem. Tente reformular o pedido.',
  DEMO_UNAVAILABLE:
    'A demonstração está temporariamente indisponível. Tente novamente dentro de momentos.',
  RUNTIME_UNAVAILABLE:
    'Não foi possível obter uma resposta neste momento. Tente novamente.',
  INVALID_RUNTIME_RESPONSE:
    'A demonstração não conseguiu concluir esta resposta de forma segura. Tente novamente.',
}

export default function DemoPage() {
  const { demoId } = useParams()
  const scrollRef = useRef(null)

  const {
    config,
    messages,
    loadingConfig,
    sending,
    configError,
    runtimeError,
    sendMessage,
    resetConversation,
    retryConfig,
  } = useDemoSession(demoId)

  const hasMessages = messages.length > 0

  const runtimeErrorCopy = useMemo(
    () => RUNTIME_ERRORS[runtimeError] ?? RUNTIME_ERRORS.RUNTIME_UNAVAILABLE,
    [runtimeError],
  )

  useEffect(() => {
    if (!scrollRef.current) return
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages, sending, runtimeError])

  if (loadingConfig) {
    return (
      <main className="app-shell loading-page">
        <div className="loading-card">
          <div className="loading-mark" />
          <div>
            <div className="skeleton skeleton-title" />
            <div className="skeleton skeleton-text" />
          </div>
        </div>
      </main>
    )
  }

  if (configError || !config) {
    return (
      <main className="app-shell centered-page">
        <ErrorState
          code={configError}
          onRetry={configError === 'DEMO_NOT_FOUND' ? null : retryConfig}
        />
      </main>
    )
  }

  return (
    <main className="app-shell">
      <div className="demo-container">
        <DemoHeader clinic={config.clinic} badge={config.ui.demo_badge_text} />

        <section className="experience-grid">
          <div className="chat-card">
            <div className="chat-topbar">
              <div>
                <span className="assistant-label">
                  <Bot size={16} />
                  Assistente administrativo
                </span>
                <p>{config.ui.subtitle}</p>
              </div>

              <div className="privacy-chip">
                <LockKeyhole size={14} />
                Sem ações reais
              </div>
            </div>

            <div
              className="conversation"
              ref={scrollRef}
              aria-live="polite"
              aria-busy={sending}
            >
              {!hasMessages ? (
                <div className="welcome-state">
                  <div className="assistant-avatar" aria-hidden="true">
                    <Bot size={20} />
                  </div>

                  <div className="welcome-copy">
                    <p className="welcome-message">{config.ui.welcome_message}</p>
                  </div>

                  <SuggestedPrompts
                    prompts={config.ui.suggested_prompts}
                    disabled={sending}
                    onSelect={sendMessage}
                  />
                </div>
              ) : null}

              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}

              {sending ? (
                <div className="message-row">
                  <div
                    className="typing-bubble"
                    aria-label="Assistente a responder"
                  >
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              ) : null}

              {runtimeError ? (
                <div className="runtime-error" role="status">
                  <strong>Não foi possível concluir esta resposta.</strong>
                  <p>{runtimeErrorCopy}</p>
                </div>
              ) : null}
            </div>

            <ChatInput
              placeholder={config.ui.input_placeholder}
              resetLabel={config.ui.reset_label}
              sending={sending}
              sampleNotice={config.ui.sample_data_notice}
              onSend={sendMessage}
              onReset={resetConversation}
            />
          </div>

          <div className="side-column">
            <div className="side-card">
              <span className="eyebrow">O QUE PODE EXPERIMENTAR</span>
              <h2>Uma conversa administrativa, com limites claros.</h2>
              <ul>
                <li>Informação sobre serviços e horários confirmados.</li>
                <li>Apoio à intenção de marcação sem executar a marcação.</li>
                <li>
                  Respostas seguras quando o pedido entra no âmbito clínico.
                </li>
              </ul>
            </div>

            <DemoNotice disclaimer={config.ui.disclaimer} />
          </div>
        </section>

        <footer className="page-footer">
          <span>Sovexxo</span>
          <span>AI · Automação · Sistemas digitais</span>
        </footer>
      </div>
    </main>
  )
}
