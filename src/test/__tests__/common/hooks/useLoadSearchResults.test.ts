import { renderHook } from '@testing-library/react';
import { useSearchParams } from 'react-router-dom';
import { SetterOrUpdater, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { SearchQueryParams } from '@common/constants/routes.constants';
import { useLoadSearchResults } from '@common/hooks/useLoadSearchResults';

jest.mock('react-router-dom', () => ({
  useSearchParams: jest.fn(),
}));
jest.mock('recoil', () => ({
  useSetRecoilState: jest.fn(),
  useRecoilState: jest.fn(),
  useRecoilValue: jest.fn(),
}));
jest.mock('@state', () => ({
  default: {
    search: {
      data: null,
      index: '',
      query: '',
    },
  },
}));

describe('useLoadSearchResults', () => {
  const setData = jest.fn();
  const fetchData = jest.fn();

  it('fetches data and updates state with query and searchBy', async () => {
    const searchParams = new URLSearchParams({
      [SearchQueryParams.Query]: 'test query',
      [SearchQueryParams.SearchBy]: 'title',
    });
    const setSearchBy = jest.fn();
    const setQuery = jest.fn();

    fetchData.mockResolvedValue([{ test: ['test value'] }]);
    (useSearchParams as jest.Mock).mockReturnValue([searchParams]);
    (useSetRecoilState as jest.Mock).mockReturnValueOnce(setData).mockReturnValueOnce(setSearchBy);
    (useRecoilState as jest.Mock)
      .mockReturnValueOnce(['', setQuery])
      .mockReturnValueOnce([false, (value: boolean) => value] as [boolean, SetterOrUpdater<boolean>]);
    (useRecoilValue as jest.Mock).mockReturnValue('title');

    renderHook(() => useLoadSearchResults(fetchData));

    expect(setSearchBy).toHaveBeenCalledWith('title');
    expect(setQuery).toHaveBeenCalledWith('test query');
    expect(fetchData).toHaveBeenCalledWith({ query: 'test query', searchBy: 'title', offset: 0 });
  });

  it('clears data when no query param', () => {
    const searchParams = new URLSearchParams({});

    (useSearchParams as jest.Mock).mockReturnValue([searchParams]);
    (useSetRecoilState as jest.Mock).mockReturnValue(setData);
    (useRecoilState as jest.Mock).mockReturnValue([false, (value: boolean) => value] as [
      boolean,
      SetterOrUpdater<boolean>,
    ]);

    renderHook(() => useLoadSearchResults(fetchData));

    expect(setData).not.toHaveBeenCalled();
    expect(fetchData).not.toHaveBeenCalled();
  });
});
