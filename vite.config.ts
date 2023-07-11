import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import { env } from 'process';

export default defineConfig(() =>
  env.npm_config_type === 'library'
    ? {
        plugins: [react(), cssInjectedByJsPlugin()],
        build: {
          lib: {
            entry: path.resolve(__dirname, 'src/embed.tsx'),
            name: 'marva-next',
            formats: ['es', 'umd'],
            fileName: format => `marva-next.${format}.js`,
          },
        },
        envPrefix: 'EDITOR_',
      }
    : {
        plugins: [react()],
        envPrefix: 'EDITOR_',
      },
);
