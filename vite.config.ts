import react from '@vitejs/plugin-react';
import path from 'path';
import { env } from 'process';
import { defineConfig } from 'vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import svgr from 'vite-plugin-svgr';

export default defineConfig(() => {
  const alias = {
    '@': path.resolve(__dirname, './src'),
  };

  // config type "library" is used for building a web-component,
  // which is used for the embedded application
  return env.npm_config_type === 'library'
    ? {
        plugins: [
          react({
            jsxRuntime: 'automatic',
          }),
          svgr(),
          cssInjectedByJsPlugin(),
        ],
        build: {
          lib: {
            entry: path.resolve(__dirname, 'src/embed.tsx'),
            name: 'linked-data',
            formats: ['es'],
            fileName: format => `linked-data.${format}.js`,
          },
          rollupOptions: {
            output: {
              inlineDynamicImports: true,
            },
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
