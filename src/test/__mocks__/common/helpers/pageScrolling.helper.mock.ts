export const getScrollableEntity = jest.fn();
export const scrollEntity = jest.fn();

jest.mock('@/common/helpers/pageScrolling.helper', () => ({
  getScrollableEntity,
  scrollEntity,
}));
