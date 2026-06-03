jest.mock('@/features/hubImport', () => ({
  ...jest.requireActual('@/features/hubImport'),
  useHubQuery: () => ({
    data: undefined,
    processed: undefined,
    isLoading: false,
    isFetching: false,
    isError: false,
    error: null,
    refetch: () => Promise.resolve(),
  }),
}));
