export const getPageMetadata = jest.fn();
export const setPageMetadata = jest.fn();
export const getCurrentPageNumber = jest.fn();
export const setCurrentPageNumber = jest.fn();
export const onPrevPageClick = jest.fn();
export const onNextPageClick = jest.fn();

jest.mock('@common/hooks/usePagination', () => ({
  usePagination: () => ({
    getPageMetadata,
    setPageMetadata,
    getCurrentPageNumber,
    setCurrentPageNumber,
    onPrevPageClick,
    onNextPageClick,
  }),
}));
