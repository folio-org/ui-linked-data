export const scrollElementIntoView = jest.fn();
export const scrollToTop = jest.fn();

jest.mock('@common/helpers/pageScrolling.helper', () => ({
  scrollElementIntoView,
  scrollToTop,
}));
