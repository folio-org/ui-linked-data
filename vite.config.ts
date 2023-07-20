import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import { env } from 'process';

export default defineConfig(() => {
  const alias = {
    '@src': path.resolve(__dirname, './src'),
    '@api': path.resolve(__dirname, './src/common/api'),
    '@constants': path.resolve(__dirname, './src/common/constants'),
    '@helpers': path.resolve(__dirname, './src/common/helpers'),
    '@hooks': path.resolve(__dirname, './src/common/hooks'),
    '@services': path.resolve(__dirname, './src/common/services'),
    '@components': path.resolve(__dirname, './src/components'),
    '@state': path.resolve(__dirname, './src/state'),
    '@views': path.resolve(__dirname, './src/views'),
  };

  return env.npm_config_type === 'library'
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
        resolve: { alias },
      }
    : {
        plugins: [react()],
        envPrefix: 'EDITOR_',
        resolve: { alias },
      };
});
