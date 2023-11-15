export const useRoutePathPattern = jest.fn();

jest.mock('@common/hooks/useRoutePathPattern', () => ({
  useRoutePathPattern,
}));
