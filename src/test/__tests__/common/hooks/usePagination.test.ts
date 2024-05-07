import { renderHook, act } from '@testing-library/react';
import { usePagination } from '@common/hooks/usePagination';

const setSearchParams = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useSearchParams: () => [new URLSearchParams({ offset: '0' }), setSearchParams],
}));

describe('usePagination', () => {
  function testOnPageClick({
    functionName,
    pageMetadata,
    defaultPageNumber,
    testResult,
  }: {
    functionName: string;
    pageMetadata: PageMetadata;
    defaultPageNumber: number;
    testResult: number;
  }) {
    const { result }: any = renderHook(() => usePagination(pageMetadata, defaultPageNumber));

    act(() => {
      result.current[functionName]?.();
    });

    expect(result.current.getCurrentPageNumber()).toBe(testResult);
  }

  describe('onPrevPageClick', () => {
    test('the current page should not be changed', () => {
      const pageMetadata = {
        number: 0,
        totalElements: 0,
        totalPages: 1,
      };
      const defaultPageNumber = 0;

      testOnPageClick({
        functionName: 'onPrevPageClick',
        pageMetadata,
        defaultPageNumber,
        testResult: defaultPageNumber,
      });
    });

    test('the current page should be changed', () => {
      const pageMetadata = {
        number: 1,
        totalElements: 10,
        totalPages: 2,
      };
      const defaultPageNumber = 1;

      testOnPageClick({ functionName: 'onPrevPageClick', pageMetadata, defaultPageNumber, testResult: 0 });
    });
  });

  describe('onNextPageClick', () => {
    test('the current page should not be changed', () => {
      const pageMetadata = {
        number: 1,
        totalElements: 0,
        totalPages: 2,
      };
      const defaultPageNumber = 1;

      testOnPageClick({
        functionName: 'onNextPageClick',
        pageMetadata,
        defaultPageNumber,
        testResult: defaultPageNumber,
      });
    });

    test('the current page should be changed', () => {
      const pageMetadata = {
        number: 0,
        totalElements: 10,
        totalPages: 2,
      };
      const defaultPageNumber = 0;

      testOnPageClick({ functionName: 'onNextPageClick', pageMetadata, defaultPageNumber, testResult: 1 });
    });
  });
});
