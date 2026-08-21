import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import boundaries from 'eslint-plugin-boundaries';
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
      'react-compiler/react-compiler': 'off',
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/refs': 'warn',
      'react-hooks/preserve-manual-memoization': 'warn',
      'preserve-caught-error': 'warn',
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

    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
  {
    files: ['src/test/**/*.js'],

    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
  {
    files: ['src/test/**/*.ts'],

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
  // === Architectural Boundary Rules ===
  {
    plugins: { boundaries },
    settings: {
      'boundaries/elements': [
        { type: 'common',     pattern: 'src/common/**' },
        { type: 'components', pattern: 'src/components/**' },
        { type: 'store',      pattern: 'src/store/**' },
        { type: 'configs',    pattern: 'src/configs/**' },
        { type: 'contexts',   pattern: 'src/contexts/**' },
        { type: 'providers',  pattern: 'src/providers/**' },
        { type: 'types',      pattern: 'src/types/**' },
        { type: 'feature-t1', pattern: 'src/features/resources/**' },
        { type: 'feature-t1', pattern: 'src/features/profiles/**' },
        { type: 'feature-t1', pattern: 'src/features/preview/**' },
        { type: 'feature-t2', pattern: 'src/features/search/**' },
        { type: 'feature-t2', pattern: 'src/features/manageProfileSettings/**' },
        { type: 'feature-t2', pattern: 'src/features/hubImport/**' },
        { type: 'feature-t3', pattern: 'src/features/edit/**' },
        { type: 'feature-t3', pattern: 'src/features/complexLookup/**' },
        { type: 'feature-t3', pattern: 'src/features/comparison/**' },
        { type: 'views',      pattern: 'src/views/**' },
        { type: 'app',        pattern: 'src/App.*' },
        { type: 'app',        pattern: 'src/main.*' },
        { type: 'app',        pattern: 'src/embed.*' },
      ],
      'boundaries/ignore': [
        'src/test/**',
        '**/*.test.ts',
        '**/*.test.tsx',
      ],
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      'boundaries/dependencies': ['error', {
        default: 'disallow',
        rules: [
          // Foundation layers - no barrel restriction on imports (they use any internal path freely)
          {
            from: { type: 'common' },
            allow: { to: { type: ['common', 'store', 'configs', 'types', 'contexts'] } },
          },
          {
            from: { type: 'components' },
            allow: { to: { type: ['common', 'components', 'store', 'configs', 'types', 'contexts'] } },
          },
          {
            from: { type: 'store' },
            allow: { to: { type: ['common', 'store', 'configs', 'types'] } },
          },
          {
            from: { type: 'configs' },
            allow: { to: { type: ['common', 'configs', 'types'] } },
          },
          {
            from: { type: 'contexts' },
            allow: { to: { type: ['common', 'components', 'store', 'configs', 'types', 'contexts'] } },
          },
          {
            from: { type: 'providers' },
            allow: { to: { type: ['common', 'components', 'store', 'configs', 'types', 'contexts', 'providers'] } },
          },
          // Tier 1 - Infrastructure: can use foundation freely + other T1 features via barrel only
          {
            from: { type: 'feature-t1' },
            allow: { to: { type: ['common', 'components', 'store', 'configs', 'types', 'contexts', 'providers'] } },
          },
          {
            from: { type: 'feature-t1' },
            allow: { to: { type: 'feature-t1', internalPath: 'index.(ts|tsx)' } },
          },
          // Tier 2 - Domain: can use foundation freely + T1 features via barrel only
          {
            from: { type: 'feature-t2' },
            allow: { to: { type: ['common', 'components', 'store', 'configs', 'types', 'contexts', 'providers'] } },
          },
          {
            from: { type: 'feature-t2' },
            allow: { to: { type: 'feature-t1', internalPath: 'index.(ts|tsx)' } },
          },
          // Tier 3 - Composite: can use foundation freely + T1/T2 features via barrel (search also allows sub-barrels)
          {
            from: { type: 'feature-t3' },
            allow: { to: { type: ['common', 'components', 'store', 'configs', 'types', 'contexts', 'providers'] } },
          },
          {
            from: { type: 'feature-t3' },
            allow: { to: { type: 'feature-t1', internalPath: 'index.(ts|tsx)' } },
          },
          {
            from: { type: 'feature-t3' },
            allow: { to: { type: 'feature-t2', internalPath: ['index.(ts|tsx)', 'ui/index.(ts|tsx)', 'core/index.(ts|tsx)'] } },
          },
          {
            from: { type: 'feature-t3' },
            allow: { to: { type: 'feature-t3', internalPath: 'index.(ts|tsx)' } },
          },
          // Views - integration layer: same as T3 + can import other views via barrel
          {
            from: { type: 'views' },
            allow: { to: { type: ['common', 'components', 'store', 'configs', 'types', 'contexts', 'providers'] } },
          },
          {
            from: { type: 'views' },
            allow: { to: { type: ['feature-t1', 'feature-t3'], internalPath: 'index.(ts|tsx)' } },
          },
          {
            from: { type: 'views' },
            allow: { to: { type: 'feature-t2', internalPath: ['index.(ts|tsx)', 'ui/index.(ts|tsx)', 'core/index.(ts|tsx)'] } },
          },
          {
            from: { type: 'views' },
            allow: { to: { type: 'views', internalPath: 'index.(ts|tsx)' } },
          },
          // App - entry points: can use all layers
          {
            from: { type: 'app' },
            allow: { to: { type: ['common', 'components', 'store', 'configs', 'types', 'contexts', 'providers'] } },
          },
          {
            from: { type: 'app' },
            allow: { to: { type: ['feature-t1', 'feature-t3'], internalPath: 'index.(ts|tsx)' } },
          },
          {
            from: { type: 'app' },
            allow: { to: { type: 'feature-t2', internalPath: ['index.(ts|tsx)', 'ui/index.(ts|tsx)', 'core/index.(ts|tsx)'] } },
          },
          {
            from: { type: 'app' },
            allow: { to: { type: 'views', internalPath: 'index.(ts|tsx)' } },
          },
          {
            from: { type: 'app' },
            allow: { to: { type: 'app' } },
          },
        ],
      }],
    },
  },
  // Intra-search layering: search/core must not import from search/ui
  {
    files: ['src/features/search/core/**/*.ts', 'src/features/search/core/**/*.tsx'],
    rules: {
      '@typescript-eslint/no-restricted-imports': ['error', {
        patterns: [{
          group: ['@/features/search/ui', '@/features/search/ui/*'],
          message: 'search/core must not import from search/ui. Dependency direction: ui -> core.',
        }],
      }],
    },
  },
];
