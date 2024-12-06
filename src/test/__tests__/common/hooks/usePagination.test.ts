import { renderHook, act } from '@testing-library/react';
import { setInitialGlobalState, setUpdatedGlobalState } from '@src/test/__mocks__/store';
import { usePagination } from '@common/hooks/usePagination';
import { useSearchStore } from '@src/store';

const setSearchParams = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useSearchParams: () => [new URLSearchParams({ offset: '0' }), setSearchParams],
}));
jest.mock('recoil', () => ({
  useRecoilValue: jest.fn(),
}));

describe('usePagination', () => {
  const hasSearchParams = true;

  beforeEach(() => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: { pageMetadata: { totalElements: 0, totalPages: 0 } },
      },
    ]);
  });

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
      setUpdatedGlobalState([
        {
          store: useSearchStore,
          updatedState: {
            pageMetadata: {
              number: 0,
              totalElements: 0,
              totalPages: 1,
            },
          },
        },
      ]);
      const defaultPageNumber = 0;

      testOnPageClick({
        functionName: 'onPrevPageClick',
        hasSearchParams,
        defaultPageNumber,
        testResult: defaultPageNumber,
      });
    });

    test('the current page should be changed', () => {
      setUpdatedGlobalState([
        {
          store: useSearchStore,
          updatedState: {
            pageMetadata: {
              number: 1,
              totalElements: 10,
              totalPages: 2,
            },
          },
        },
      ]);
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
      setUpdatedGlobalState([
        {
          store: useSearchStore,
          updatedState: {
            pageMetadata: {
              number: 1,
              totalElements: 0,
              totalPages: 2,
            },
          },
        },
      ]);
      const defaultPageNumber = 1;

      testOnPageClick({
        functionName: 'onNextPageClick',
        hasSearchParams,
        defaultPageNumber,
        testResult: defaultPageNumber,
      });
    });

    test('the current page should be changed', () => {
      setUpdatedGlobalState([
        {
          store: useSearchStore,
          updatedState: {
            pageMetadata: {
              number: 0,
              totalElements: 10,
              totalPages: 2,
            },
          },
        },
      ]);
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
