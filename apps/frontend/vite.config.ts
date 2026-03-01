import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    base:
      env.VITE_DEPLOY_MODE === 'github-pages' || env.VITE_DEPLOY_MODE === 'gist'
        ? '/NavGate/'
        : '/',
    build: {
      outDir: 'dist',
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
          },
        },
      },
    },
    server: {
      port: 5173,
      proxy:
        env.VITE_DEPLOY_MODE === 'backend'
          ? {
              '/api': {
                target: env.VITE_API_BASE_URL || 'http://localhost:3000',
                changeOrigin: true,
              },
            }
          : undefined,
    },
  }
})
