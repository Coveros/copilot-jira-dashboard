import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy Jira API requests to avoid CORS issues in development
      '/api/jira': {
        target: process.env.VITE_JIRA_BASE_URL || 'https://your-domain.atlassian.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/jira/, ''),
      },
    },
  },
})
