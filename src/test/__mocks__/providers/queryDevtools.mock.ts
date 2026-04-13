jest.mock('@/providers/queryDevtools', () => ({
  ReactQueryDevtools: () => null,
}));
