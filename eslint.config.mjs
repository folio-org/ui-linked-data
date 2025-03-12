import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import jest from 'eslint-plugin-jest';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...fixupConfigRules(
    compat.extends(
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react-hooks/recommended',
      'prettier',
    ),
  ),
  {
    plugins: {
      '@typescript-eslint': fixupPluginRules(typescriptEslint),
    },

    languageOptions: {
      globals: {
        ...globals.browser,
      },

      parser: tsParser,
      ecmaVersion: 12,
      sourceType: 'module',
    },

    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-expressions': 'warn',
      '@typescript-eslint/no-require-imports': 'warn',
      'react-hooks/exhaustive-deps': 'off',
      'no-fallthrough': [
        'error',
        {
          allowEmptyCase: true,
        },
      ],
    },
  },
  ...compat.extends('plugin:jest/recommended').map(config => ({
    ...config,
    files: ['src/test/**/*.ts'],
  })),
  {
    files: ['src/test/**/*.ts'],

    plugins: {
      jest,
    },

    rules: {
      'jest/prefer-expect-assertions': 'off',
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'warn',
      'jest/valid-expect': 'error',
      'jest/no-mocks-import': 'off',
      'jest/no-export': 'off',

      'jest/expect-expect': [
        'error',
        {
          assertFunctionNames: ['expect', 'test*'],
        },
      ],
    },
  },
  ...compat.extends('plugin:testing-library/react').map(config => ({
    ...config,
    files: ['src/test/**/*.tsx'],
  })),
  {
    files: ['src/test/**/*.tsx'],

    rules: {
      'testing-library/await-async-queries': 'error',
      'testing-library/no-await-sync-queries': 'error',
      'testing-library/await-async-utils': 'warn',
      'testing-library/no-wait-for-side-effects': 'warn',
      'testing-library/no-debugging-utils': 'warn',
      'testing-library/no-dom-import': 'off',
      'testing-library/no-node-access': 'off',

      'testing-library/no-render-in-lifecycle': [
        'error',
        {
          allowTestingFrameworkSetupHook: 'beforeEach',
        },
      ],

      'testing-library/no-unnecessary-act': [
        'warn',
        {
          isStrict: false,
        },
      ],

      'testing-library/prefer-screen-queries': 'off',

      'testing-library/prefer-presence-queries': [
        'error',
        {
          absence: false,
          presence: true,
        },
      ],

      'testing-library/no-wait-for-multiple-assertions': 'warn',
      'testing-library/no-container': 'off',
    },
  },
];
