export const getProfiles = jest.fn();

jest.mock('@common/hooks/useConfig.hook', () => ({
  useConfig: () => ({
    getProfiles,
  }),
}));
