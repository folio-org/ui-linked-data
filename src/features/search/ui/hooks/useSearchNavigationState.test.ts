import { renderHook } from '@testing-library/react';
import { useSearchParams } from 'react-router-dom';
import { SearchQueryParams } from '@/common/constants/routes.constants';
import * as SearchHelper from '@/features/search/core/utils/search.helper';
import { setInitialGlobalState } from '@/test/__mocks__/store';
import { useSearchStore } from '@/store';
import { useSearchNavigationState } from './useSearchNavigationState';

jest.mock('react-router-dom', () => ({
  useSearchParams: jest.fn(),
}));

const setNavigationState = jest.fn();

describe('useSearchNavigationState', () => {
  beforeEach(() => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: { navigationState: {}, setNavigationState },
      },
    ]);
  });

  it('sets navigation state based on search params', () => {
    const searchParams = new URLSearchParams({
      [SearchQueryParams.Query]: 'test query',
      [SearchQueryParams.SearchBy]: 'title',
      [SearchQueryParams.Offset]: '1',
    });
    const generatedState = { some: 'state' };

    (useSearchParams as jest.Mock).mockReturnValue([searchParams]);
    const spyGenerateSearchParamsState = jest
      .spyOn(SearchHelper, 'generateSearchParamsState')
      .mockReturnValue(generatedState as SearchParamsState);

    renderHook(() => useSearchNavigationState());

    expect(spyGenerateSearchParamsState).toHaveBeenCalledWith('test query', 'title', '1');
    expect(setNavigationState).toHaveBeenCalledWith(generatedState);
  });
});
