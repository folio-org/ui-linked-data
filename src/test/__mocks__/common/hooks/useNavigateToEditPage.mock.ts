export const navigateToEditPage = jest.fn();
export const navigateAsDuplicate = jest.fn();

jest.mock('@/common/hooks/useNavigateToEditPage', () => ({
  useNavigateToEditPage: () => ({
    navigateToEditPage,
    navigateAsDuplicate,
  }),
}));
