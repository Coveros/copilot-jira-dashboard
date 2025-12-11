import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    server: {
      proxy: {
        // Proxy Jira API requests to avoid CORS issues in development
        '/api/jira': {
          target: env.VITE_JIRA_BASE_URL || 'https://your-domain.atlassian.net',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/jira/, ''),
        },
      },
    },
  };
})
