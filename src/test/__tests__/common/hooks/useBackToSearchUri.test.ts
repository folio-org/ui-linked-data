import { renderHook } from '@testing-library/react';
import { useLocation, Location } from 'react-router-dom';
import { SearchQueryParams, ROUTES } from '@common/constants/routes.constants';
import { useBackToSearchUri } from '@common/hooks/useBackToSearchUri';

jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(),
}));

describe('useBackToSearchUri', () => {
  const testUseBackToSearchHook = (state: Location, testResult: string) => {
    (useLocation as jest.Mock).mockReturnValue(state);

    const { result } = renderHook(() => useBackToSearchUri());

    expect(result.current).toBe(testResult);
  };

  it('returns default search URI when no state', () => {
    testUseBackToSearchHook({ state: null } as Location, ROUTES.SEARCH.uri);
  });

  it('returns search URI with query param when state has only query', () => {
    testUseBackToSearchHook(
      {
        state: {
          [SearchQueryParams.Query]: 'test query',
        },
      } as Location,
      '/search?query=test+query',
    );
  });

  it('returns search URI with query and searchBy params when state has both', () => {
    testUseBackToSearchHook(
      {
        state: {
          [SearchQueryParams.Query]: 'test query',
          [SearchQueryParams.SearchBy]: 'title',
        },
      } as Location,
      '/search?query=test+query&searchBy=title',
    );
  });
});
