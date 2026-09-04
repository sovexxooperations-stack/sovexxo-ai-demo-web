import { useCallback, useEffect, useRef, useState } from 'react'
import { API, MAX_MESSAGE_LENGTH } from '../config.js'

function newSessionId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0
    const value = char === 'x' ? random : (random & 0x3) | 0x8
    return value.toString(16)
  })
}

function validateConfig(payload) {
  return Boolean(
    payload &&
      payload.success === true &&
      typeof payload.demo_id === 'string' &&
      payload.clinic &&
      typeof payload.clinic.name === 'string' &&
      payload.ui &&
      typeof payload.ui.welcome_message === 'string' &&
      Array.isArray(payload.ui.suggested_prompts),
  )
}

function validateRuntime(payload, sessionId) {
  return Boolean(
    payload &&
      payload.success === true &&
      payload.demo === true &&
      payload.session_id === sessionId &&
      typeof payload.assistant_message === 'string' &&
      payload.assistant_message.trim().length > 0,
  )
}

export function useDemoSession(demoId) {
  const [config, setConfig] = useState(null)
  const [messages, setMessages] = useState([])
  const [loadingConfig, setLoadingConfig] = useState(true)
  const [sending, setSending] = useState(false)
  const [configError, setConfigError] = useState(null)
  const [runtimeError, setRuntimeError] = useState(null)
  const sessionIdRef = useRef(newSessionId())

  const loadConfig = useCallback(async () => {
    setLoadingConfig(true)
    setConfigError(null)

    try {
      const response = await fetch(
        `${API.publicConfig}?demo_id=${encodeURIComponent(demoId)}`,
        {
          method: 'GET',
          headers: { Accept: 'application/json' },
          cache: 'no-store',
        },
      )

      if (response.status === 404) throw new Error('DEMO_NOT_FOUND')
      if (!response.ok) throw new Error('CONFIG_UNAVAILABLE')

      const payload = await response.json()
      if (!validateConfig(payload)) throw new Error('INVALID_CONFIG_RESPONSE')

      setConfig(payload)
    } catch (error) {
      setConfig(null)
      setConfigError(error instanceof Error ? error.message : 'CONFIG_UNAVAILABLE')
    } finally {
      setLoadingConfig(false)
    }
  }, [demoId])

  useEffect(() => {
    loadConfig()
  }, [loadConfig])

  const sendMessage = useCallback(
    async (rawMessage) => {
      const message = rawMessage.trim()

      if (!config || !message || sending) return
      if (message.length > MAX_MESSAGE_LENGTH) return

      const userMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: message,
      }

      setMessages((current) => [...current, userMessage])
      setRuntimeError(null)
      setSending(true)

      try {
        const sessionId = sessionIdRef.current

        const response = await fetch(API.runtime, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            demo_id: demoId,
            session_id: sessionId,
            message,
          }),
        })

        if (response.status === 400) throw new Error('INVALID_REQUEST')
        if (response.status === 503) throw new Error('DEMO_UNAVAILABLE')
        if (!response.ok) throw new Error('RUNTIME_UNAVAILABLE')

        const payload = await response.json()
        if (!validateRuntime(payload, sessionId)) {
          throw new Error('INVALID_RUNTIME_RESPONSE')
        }

        setMessages((current) => [
          ...current,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: payload.assistant_message.trim(),
          },
        ])
      } catch (error) {
        setRuntimeError(
          error instanceof Error ? error.message : 'RUNTIME_UNAVAILABLE',
        )
      } finally {
        setSending(false)
      }
    },
    [config, demoId, sending],
  )

  const resetConversation = useCallback(() => {
    sessionIdRef.current = newSessionId()
    setMessages([])
    setRuntimeError(null)
  }, [])

  return {
    config,
    messages,
    loadingConfig,
    sending,
    configError,
    runtimeError,
    sendMessage,
    resetConversation,
    retryConfig: loadConfig,
  }
}
