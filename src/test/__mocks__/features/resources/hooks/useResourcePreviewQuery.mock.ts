jest.mock('@/features/resources', () => ({
  ...jest.requireActual('@/features/resources'),
  useResourcePreviewQuery: () => ({ data: undefined, isLoading: false }),
}));
