import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.aliases.json';

export default {
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '\\.(css|sass|scss)$': 'identity-obj-proxy',
    ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  },
  restoreMocks: true,
  resetMocks: true,
  setupFiles: ['<rootDir>/src/test/__mocks__/setupMocks.ts'],
  setupFilesAfterEnv: [
    "<rootDir>/src/test/setupTests.ts"
  ],
};
