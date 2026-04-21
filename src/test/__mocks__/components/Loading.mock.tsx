jest.mock('@/components/Loading', () => ({
  Loading: () => <div data-testid="loading-component" />,
}));
