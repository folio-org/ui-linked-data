export const getProfiles = jest.fn();

jest.mock('@common/hooks/useConfig.hook', () => ({
  useConfig: () => ({
    getProfiles,
  }),
}));

// TODO: delete this after deleting "IS_NEW_SCHEMA_BUILDING_ALGORITHM_ENABLED" feature variable
jest.mock('@common/hooks/useConfig_OLD.hook', () => ({
  useConfig: () => ({
    getProfiles,
  }),
}));
