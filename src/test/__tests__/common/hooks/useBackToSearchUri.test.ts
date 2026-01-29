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

  it('returns search URI with segment param when state has segment', () => {
    testUseBackToSearchHook(
      {
        state: {
          [SearchQueryParams.Query]: 'test',
          [SearchQueryParams.Segment]: 'hubs',
        },
      } as Location,
      '/search?query=test&segment=hubs',
    );
  });

  it('returns search URI with source param when state has source', () => {
    testUseBackToSearchHook(
      {
        state: {
          [SearchQueryParams.Query]: 'test',
          [SearchQueryParams.Source]: 'libraryOfCongress',
        },
      } as Location,
      '/search?query=test&source=libraryOfCongress',
    );
  });

  it('returns search URI with offset param when state has offset', () => {
    testUseBackToSearchHook(
      {
        state: {
          [SearchQueryParams.Query]: 'test',
          [SearchQueryParams.Offset]: '20',
        },
      } as Location,
      '/search?query=test&offset=20',
    );
  });

  it('returns search URI with all params when state has all values', () => {
    testUseBackToSearchHook(
      {
        state: {
          [SearchQueryParams.Query]: 'test query',
          [SearchQueryParams.SearchBy]: 'lccn',
          [SearchQueryParams.Segment]: 'hubs',
          [SearchQueryParams.Source]: 'libraryOfCongress',
          [SearchQueryParams.Offset]: '40',
        },
      } as Location,
      '/search?query=test+query&searchBy=lccn&offset=40&segment=hubs&source=libraryOfCongress',
    );
  });

  it('returns search URI with only segment when no query but segment exists', () => {
    testUseBackToSearchHook(
      {
        state: {
          [SearchQueryParams.Segment]: 'resources',
        },
      } as Location,
      '/search?segment=resources',
    );
  });
});
