import { renderHook } from '@testing-library/react';
import { useSearchParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { SearchQueryParams } from '@common/constants/routes.constants';
import { useLoadSearchResults } from '@common/hooks/useLoadSearchResults';

jest.mock('react-router-dom', () => ({
  useSearchParams: jest.fn(),
}));
jest.mock('recoil', () => ({
  useSetRecoilState: jest.fn(),
}));
jest.mock('@state', () => ({
  default: {
    search: {
      data: null,
      index: 'title',
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
    (useSetRecoilState as jest.Mock)
      .mockReturnValueOnce(setData)
      .mockReturnValueOnce(setSearchBy)
      .mockReturnValueOnce(setQuery);

    renderHook(() => useLoadSearchResults(fetchData));

    expect(setSearchBy).toHaveBeenCalledWith('title');
    expect(setQuery).toHaveBeenCalledWith('test query');
    expect(fetchData).toHaveBeenCalledWith('test query', 'title', 0);
  });

  it('clears data when no query param', () => {
    const searchParams = new URLSearchParams({});

    (useSearchParams as jest.Mock).mockReturnValue([searchParams]);
    (useSetRecoilState as jest.Mock).mockReturnValue(setData);

    renderHook(() => useLoadSearchResults(fetchData));

    expect(setData).toHaveBeenCalledWith(null);
    expect(fetchData).not.toHaveBeenCalled();
  });
});
