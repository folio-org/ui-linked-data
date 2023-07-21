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
  setupFiles: ['<rootDir>/src/test/__mock__/setupMocks.ts'],
};
