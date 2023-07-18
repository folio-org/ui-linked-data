export default {
  testEnvironment: 'jsdom',
  testMatch: [
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}',
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '\\.(css|sass|scss)$': 'identity-obj-proxy',
  },
  setupFiles: [
    '<rootDir>/src/test/__mock__/env.helper.mock.ts',
  ],
};
