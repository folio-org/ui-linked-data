import { renderHook } from '@testing-library/react';
import { useSearchParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { SearchQueryParams } from '@common/constants/routes.constants';
import * as SearchHelper from '@common/helpers/search.helper';
import { useSearchNavigationState } from '@common/hooks/useSearchNavigationState';

jest.mock('@state', () => ({
  default: {
    search: {
      navigationState: {},
    },
  },
}));
jest.mock('react-router-dom', () => ({
  useSearchParams: jest.fn(),
}));
jest.mock('recoil', () => ({
  useSetRecoilState: jest.fn(),
}));

describe('useSearchNavigationState', () => {
  it('sets navigation state based on search params', () => {
    const searchParams = new URLSearchParams({
      [SearchQueryParams.Query]: 'test query',
      [SearchQueryParams.SearchBy]: 'title',
      [SearchQueryParams.Offset]: '1',
    });
    const setNavigationState = jest.fn();
    const generatedState = { some: 'state' };

    (useSearchParams as jest.Mock).mockReturnValue([searchParams]);
    (useSetRecoilState as jest.Mock).mockReturnValue(setNavigationState);
    const spyGenerateSearchParamsState = jest
      .spyOn(SearchHelper, 'generateSearchParamsState')
      .mockReturnValue(generatedState as SearchParamsState);

    renderHook(() => useSearchNavigationState());

    expect(spyGenerateSearchParamsState).toHaveBeenCalledWith('test query', 'title', '1');
    expect(setNavigationState).toHaveBeenCalledWith(generatedState);
  });
});
