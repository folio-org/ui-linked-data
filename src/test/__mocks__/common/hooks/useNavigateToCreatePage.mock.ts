export const onCreateNewResource = jest.fn();

jest.mock('@/common/hooks/useNavigateToCreatePage', () => ({
  useNavigateToCreatePage: () => ({
    onCreateNewResource,
  }),
}));
