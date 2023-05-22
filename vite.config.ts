import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import { env } from 'process'

export default defineConfig(() => (
  Number(env.EDITOR_BUILD_TYPE) ? {
    plugins: [
      react(),
      cssInjectedByJsPlugin(),
    ],
    build: {
      lib: {
        entry: path.resolve(__dirname, 'src/App.tsx'),
        name: 'marva-next',
        formats: ['es', 'umd'],
        fileName: (format) => `marva-next.${format}.js`,
      },
      rollupOptions: {
        external: [
          'react',
          'react-dom',
          'react-router-dom',
          'react-router',
        ],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            'react-router-dom': 'react-router-dom',
            'react-router': 'react-router',
          },
        },
      },
    }
  } : {
    plugins: [react()]
  }
))
