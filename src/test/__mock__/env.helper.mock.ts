export const getEnvVariable = (name: string) => name;

jest.mock('../../common/helpers/env.helper.ts', () => ({
  getEnvVariable,
}));
