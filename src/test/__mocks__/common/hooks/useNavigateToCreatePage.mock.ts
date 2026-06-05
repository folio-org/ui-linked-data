export const onCreateNewResource = jest.fn();

jest.mock('@/features/profiles/hooks/useNavigateToCreatePage', () => ({
  useNavigateToCreatePage: () => ({
    onCreateNewResource,
  }),
}));
