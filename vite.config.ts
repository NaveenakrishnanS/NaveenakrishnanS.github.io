import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), tailwindcss()],
  // One constant for both the SSR and client builds, so the footer year cannot cause a hydration mismatch.
  define: { __BUILD_YEAR__: JSON.stringify(new Date().getFullYear()) },
  // Two client pages: the site and the static 404. The SSR build keeps its own entry (src/entry-server.tsx).
  build: isSsrBuild ? undefined : { rollupOptions: { input: { main: './index.html', notFound: './404.html' } } },
}))
