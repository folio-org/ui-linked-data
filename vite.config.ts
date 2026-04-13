import react from '@vitejs/plugin-react';
import path from 'node:path';
import { env } from 'node:process';
import { defineConfig } from 'vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import svgr from 'vite-plugin-svgr';

export default defineConfig(() => {
  const alias = {
    '@': path.resolve(import.meta.dirname, './src'),
  };

  // config type "library" is used for building a web-component,
  // which is used for the embedded application
  return env.npm_config_type === 'library'
    ? {
        plugins: [react(), svgr(), cssInjectedByJsPlugin()],
        build: {
          lib: {
            entry: path.resolve(import.meta.dirname, 'src/embed.tsx'),
            name: 'linked-data',
            formats: ['es'],
            fileName: format => `linked-data.${format}.js`,
          },
        },
        envPrefix: 'EDITOR_',
        resolve: { alias },
        define: {
          __IS_EMBEDDED_MODE__: true,
        },
      }
    : {
        plugins: [react(), svgr()],
        envPrefix: 'EDITOR_',
        resolve: { alias },
        define: {
          __IS_EMBEDDED_MODE__: false,
        },
      };
});
