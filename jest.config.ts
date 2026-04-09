import { pathsToModuleNameMapper } from 'ts-jest';

import { compilerOptions } from './tsconfig.aliases.json' with { type: 'json' };

export default {
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: './tsconfig.test.json' }],
    '^.+\\.jsx?$': ['ts-jest', { tsconfig: './tsconfig.test.json' }], // Transform JavaScript files including from node_modules/uuid
  },
  transformIgnorePatterns: [
    'node_modules[\\\\/](?!(uuid|react-intl|intl-messageformat|@formatjs)[\\\\/])', // Transform ESM-only packages
  ],
  coverageDirectory: '<rootDir>/artifacts/coverage-jest/',
  moduleNameMapper: {
    '\\.(css|sass|scss)$': 'identity-obj-proxy',
    '\\.(svg)(\\?react)$': '<rootDir>/src/test/__mocks__/svg.ts',
    ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  },
  restoreMocks: true,
  resetMocks: true,
  setupFiles: ['<rootDir>/src/test/__mocks__/setupMocks.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/test/setupTests.ts'],
};
