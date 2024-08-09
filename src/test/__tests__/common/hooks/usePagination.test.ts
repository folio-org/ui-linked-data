import { useRecoilValue } from 'recoil';
import { renderHook, act } from '@testing-library/react';
import { usePagination } from '@common/hooks/usePagination';

const setSearchParams = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useSearchParams: () => [new URLSearchParams({ offset: '0' }), setSearchParams],
}));
jest.mock('recoil', () => ({
  useRecoilValue: jest.fn(),
}));
jest.mock('@state', () => ({
  default: {
    search: {
      pageMetadata: { totalElements: 0, totalPages: 0 },
    },
  },
}));

describe('usePagination', () => {
  const hasSearchParams = true;

  function testOnPageClick({
    functionName,
    hasSearchParams,
    defaultPageNumber,
    testResult,
  }: {
    functionName: string;
    hasSearchParams: boolean;
    defaultPageNumber: number;
    testResult: number;
  }) {
    const { result }: any = renderHook(() => usePagination(hasSearchParams, defaultPageNumber));

    act(() => {
      result.current[functionName]?.();
    });

    expect(result.current.getCurrentPageNumber()).toBe(testResult);
  }

  describe('onPrevPageClick', () => {
    test('the current page should not be changed', () => {
      (useRecoilValue as jest.Mock).mockReturnValue({
        number: 0,
        totalElements: 0,
        totalPages: 1,
      });
      const defaultPageNumber = 0;

      testOnPageClick({
        functionName: 'onPrevPageClick',
        hasSearchParams,
        defaultPageNumber,
        testResult: defaultPageNumber,
      });
    });

    test('the current page should be changed', () => {
      (useRecoilValue as jest.Mock).mockReturnValue({
        number: 1,
        totalElements: 10,
        totalPages: 2,
      });
      const defaultPageNumber = 1;

      testOnPageClick({
        functionName: 'onPrevPageClick',
        hasSearchParams,
        defaultPageNumber,
        testResult: 0,
      });
    });
  });

  describe('onNextPageClick', () => {
    test('the current page should not be changed', () => {
      (useRecoilValue as jest.Mock).mockReturnValue({
        number: 1,
        totalElements: 0,
        totalPages: 2,
      });
      const defaultPageNumber = 1;

      testOnPageClick({
        functionName: 'onNextPageClick',
        hasSearchParams,
        defaultPageNumber,
        testResult: defaultPageNumber,
      });
    });

    test('the current page should be changed', () => {
      (useRecoilValue as jest.Mock).mockReturnValue({
        number: 0,
        totalElements: 10,
        totalPages: 2,
      });
      const defaultPageNumber = 0;

      testOnPageClick({
        functionName: 'onNextPageClick',
        hasSearchParams,
        defaultPageNumber,
        testResult: 1,
      });
    });
  });
});
