export const getEnvVariable = (name: string) => name;

jest.mock('@helpers/env.helper.ts', () => ({
  getEnvVariable,
}));
