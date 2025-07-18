import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import { env } from 'process';

export default defineConfig(() => {
  const alias = {
    '@src': path.resolve(__dirname, './src'),
    '@common': path.resolve(__dirname, './src/common'),
    '@components': path.resolve(__dirname, './src/components'),
    '@views': path.resolve(__dirname, './src/views'),
  };

  // config type "library" is used for building a web-component,
  // which is used for the embedded application
  return env.npm_config_type === 'library'
    ? {
        plugins: [react(), svgr(), cssInjectedByJsPlugin()],
        build: {
          lib: {
            entry: path.resolve(__dirname, 'src/embed.tsx'),
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
