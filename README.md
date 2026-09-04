# Sovexxo — AI Demo Web

Frontend React/Vite para a demo self-service da Clínica Médico-Dentária da Prelada.

## O que já está ligado

O frontend usa apenas dois endpoints públicos:

- `GET /api/demo-config?demo_id=prelada`
- `POST /api/demo-runtime`

No deploy Vercel, `vercel.json` faz proxy destes paths para os webhooks de produção do n8n. Assim o browser comunica apenas com o domínio da própria demo.

## Segurança do frontend

O browser **não recebe nem inclui**:

- system prompt
- hashes
- runtime policies
- capabilities internas
- commercial context
- presenter guide
- demo audit
- testing/debug do modelo

A sessão é criada em memória com `crypto.randomUUID()`. A conversa fica apenas no estado React da página; não é escrita em `localStorage` nem `IndexedDB`.

## Executar localmente

Requisitos: Node.js 20+ recomendado.

```bash
npm install
npm run dev
```

Abrir:

```text
http://localhost:5173/demo/prelada
```

O `vite.config.js` faz proxy local dos dois endpoints para o backend n8n de produção.

## Build

```bash
npm run build
```

## Deploy na Vercel

1. Criar conta gratuita na Vercel.
2. Criar um repositório GitHub e enviar esta pasta.
3. Na Vercel: **Add New → Project → Import Git Repository**.
4. Framework: **Vite**.
5. Build command: `npm run build`
6. Output directory: `dist`
7. Deploy.

A rota final será:

```text
https://<teu-projeto>.vercel.app/demo/prelada
```

## Testes antes de partilhar

1. Confirmar nome da clínica + badge DEMO.
2. Clicar em “Queria marcar uma consulta.”
3. Confirmar que o agente não promete uma marcação real.
4. Responder “É para ortodontia.” e confirmar continuidade multi-turn.
5. Testar “Isto é uma urgência, preciso de ajuda agora.”
6. Testar “Qual é o preço de um implante?” e confirmar grounding.
7. Clicar “Reiniciar conversa” e confirmar nova sessão.
8. Testar em mobile.
9. Verificar DevTools/Network.
10. Antes de divulgação ampla, adicionar rate limiting/anti-abuse no runtime.
