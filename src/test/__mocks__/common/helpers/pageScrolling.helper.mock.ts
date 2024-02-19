export const getScrollableEntity = jest.fn();
export const scrollEntity = jest.fn();
export const scrollElementIntoView = jest.fn();
export const scrollToTop = jest.fn();
export const getByClassNameAndScrollToTop = jest.fn();

jest.mock('@common/helpers/pageScrolling.helper', () => ({
  getScrollableEntity,
  scrollEntity,
  scrollElementIntoView,
  scrollToTop,
  getByClassNameAndScrollToTop,
}));
