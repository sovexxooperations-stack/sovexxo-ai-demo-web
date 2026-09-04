import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const backend = 'https://purple-chimpanzee-997024.hostingersite.com'

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      '/api/demo-config': {
        target: backend,
        changeOrigin: true,
        secure: true,
        rewrite: (path) =>
          path.replace(
            /^\/api\/demo-config/,
            '/webhook/ai-demo-config',
          ),
      },

      '/api/demo-runtime': {
        target: backend,
        changeOrigin: true,
        secure: true,
        rewrite: (path) =>
          path.replace(
            /^\/api\/demo-runtime/,
            '/webhook/ai-demo-runtime',
          ),
      },
    },
  },
})