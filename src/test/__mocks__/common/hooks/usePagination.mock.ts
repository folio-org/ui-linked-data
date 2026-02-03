export const getCurrentPageNumber = jest.fn();
export const setCurrentPageNumber = jest.fn();
export const onPrevPageClick = jest.fn();
export const onNextPageClick = jest.fn();

jest.mock('@/common/hooks/usePagination', () => ({
  usePagination: () => ({
    getCurrentPageNumber,
    setCurrentPageNumber,
    onPrevPageClick,
    onNextPageClick,
  }),
}));
