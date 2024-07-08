export const navigateToEditPage = jest.fn();

jest.mock('@common/hooks/useNavigateToEditPage', () => ({
  useNavigateToEditPage: () => ({
    navigateToEditPage,
  }),
}));
