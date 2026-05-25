export const initNewResource = jest.fn();
export const loadResource = jest.fn();

jest.mock('@/features/edit/hooks/useEditPage', () => ({
  useEditPage: () => ({
    initNewResource,
    loadResource,
  }),
}));
