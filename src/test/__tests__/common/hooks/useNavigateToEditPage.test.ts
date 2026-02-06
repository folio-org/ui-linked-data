import { setInitialGlobalState, setUpdatedGlobalState } from '@/test/__mocks__/store';

import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { renderHook } from '@testing-library/react';

import { SearchQueryParams } from '@/common/constants/routes.constants';
import { useNavigateToEditPage } from '@/common/hooks/useNavigateToEditPage';

import { useSearchStore } from '@/store';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  useSearchParams: jest.fn(),
  useLocation: jest.fn(),
}));

describe('useNavigateToEditPage', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useLocation as jest.Mock).mockReturnValue({ state: null });
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: { navigationState: {} },
      },
    ]);
  });

  it('navigates to Edit page with navigation state', () => {
    const uri = '/edit/123';
    const navigationState = {
      [SearchQueryParams.Query]: 'existing query',
      [SearchQueryParams.SearchBy]: 'title',
    };
    setUpdatedGlobalState([
      {
        store: useSearchStore,
        updatedState: { navigationState: navigationState as SearchParamsState },
      },
    ]);
    (useSearchParams as jest.Mock).mockReturnValue([new URLSearchParams()]);

    const { result } = renderHook(() => useNavigateToEditPage());
    const { navigateToEditPage } = result.current;

    navigateToEditPage(uri);

    expect(mockNavigate).toHaveBeenCalledWith(uri, { state: { ...navigationState, isNavigatedFromLDE: true } });
  });

  it('reads from URL when navigationState is empty', () => {
    const uri = '/edit/456';
    setUpdatedGlobalState([
      {
        store: useSearchStore,
        updatedState: { navigationState: {} },
      },
    ]);

    const searchParams = new URLSearchParams({
      [SearchQueryParams.Query]: 'test query',
      [SearchQueryParams.SearchBy]: 'title',
      [SearchQueryParams.Segment]: 'hubs',
    });
    (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

    const { result } = renderHook(() => useNavigateToEditPage());
    const { navigateToEditPage } = result.current;

    navigateToEditPage(uri);

    expect(mockNavigate).toHaveBeenCalledWith(uri, {
      state: {
        [SearchQueryParams.Query]: 'test query',
        [SearchQueryParams.SearchBy]: 'title',
        [SearchQueryParams.Segment]: 'hubs',
        isNavigatedFromLDE: true,
      },
    });
  });

  it('reads all params from URL including offset and source', () => {
    const uri = '/edit/789';
    setUpdatedGlobalState([
      {
        store: useSearchStore,
        updatedState: { navigationState: {} },
      },
    ]);

    const searchParams = new URLSearchParams({
      [SearchQueryParams.Query]: 'test',
      [SearchQueryParams.SearchBy]: 'lccn',
      [SearchQueryParams.Segment]: 'hubs',
      [SearchQueryParams.Source]: 'libraryOfCongress',
      [SearchQueryParams.Offset]: '40',
    });
    (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

    const { result } = renderHook(() => useNavigateToEditPage());
    const { navigateToEditPage } = result.current;

    navigateToEditPage(uri);

    expect(mockNavigate).toHaveBeenCalledWith(uri, {
      state: {
        [SearchQueryParams.Query]: 'test',
        [SearchQueryParams.SearchBy]: 'lccn',
        [SearchQueryParams.Segment]: 'hubs',
        [SearchQueryParams.Source]: 'libraryOfCongress',
        [SearchQueryParams.Offset]: '40',
        isNavigatedFromLDE: true,
      },
    });
  });

  it('prefers navigationState over URL when navigationState has query', () => {
    const uri = '/edit/101';
    const navigationState = {
      [SearchQueryParams.Query]: 'state query',
      [SearchQueryParams.Segment]: 'resources',
    };
    setUpdatedGlobalState([
      {
        store: useSearchStore,
        updatedState: { navigationState: navigationState as SearchParamsState },
      },
    ]);

    const searchParams = new URLSearchParams({
      [SearchQueryParams.Query]: 'url query',
      [SearchQueryParams.Segment]: 'hubs',
    });
    (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

    const { result } = renderHook(() => useNavigateToEditPage());
    const { navigateToEditPage } = result.current;

    navigateToEditPage(uri);

    expect(mockNavigate).toHaveBeenCalledWith(uri, {
      state: { ...navigationState, isNavigatedFromLDE: true },
    });
  });

  it('prefers navigationState over URL when navigationState has only segment', () => {
    const uri = '/edit/102';
    const navigationState = {
      [SearchQueryParams.Segment]: 'hubs',
    };
    setUpdatedGlobalState([
      {
        store: useSearchStore,
        updatedState: { navigationState: navigationState as SearchParamsState },
      },
    ]);

    const searchParams = new URLSearchParams({
      [SearchQueryParams.Query]: 'url query',
      [SearchQueryParams.Segment]: 'resources',
    });
    (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

    const { result } = renderHook(() => useNavigateToEditPage());
    const { navigateToEditPage } = result.current;

    navigateToEditPage(uri);

    expect(mockNavigate).toHaveBeenCalledWith(uri, {
      state: { ...navigationState, isNavigatedFromLDE: true },
    });
  });

  it('navigates as duplicate with navigation state', () => {
    const duplicateId = 'dup-123';
    const navigationState = {
      [SearchQueryParams.Query]: 'test',
      [SearchQueryParams.Segment]: 'hubs',
    };
    setUpdatedGlobalState([
      {
        store: useSearchStore,
        updatedState: { navigationState: navigationState as SearchParamsState },
      },
    ]);
    (useSearchParams as jest.Mock).mockReturnValue([new URLSearchParams()]);

    const { result } = renderHook(() => useNavigateToEditPage());
    const { navigateAsDuplicate } = result.current;

    navigateAsDuplicate(duplicateId);

    expect(mockNavigate).toHaveBeenCalledWith('/resources/create?cloneOf=dup-123', { state: navigationState });
  });

  it('falls back to location.state when navigationState and URL params are empty', () => {
    const uri = '/edit/location-state-test';
    const locationState = {
      [SearchQueryParams.Query]: 'location query',
      [SearchQueryParams.SearchBy]: 'contributor',
      [SearchQueryParams.Segment]: 'resources',
      isNavigatedFromLDE: true,
    };

    setUpdatedGlobalState([
      {
        store: useSearchStore,
        updatedState: { navigationState: {} },
      },
    ]);
    (useSearchParams as jest.Mock).mockReturnValue([new URLSearchParams()]);
    (useLocation as jest.Mock).mockReturnValue({ state: locationState });

    const { result } = renderHook(() => useNavigateToEditPage());
    const { navigateToEditPage } = result.current;

    navigateToEditPage(uri);

    expect(mockNavigate).toHaveBeenCalledWith(uri, {
      state: {
        [SearchQueryParams.Query]: 'location query',
        [SearchQueryParams.SearchBy]: 'contributor',
        [SearchQueryParams.Segment]: 'resources',
        isNavigatedFromLDE: true,
      },
    });
  });

  it('prefers URL params over location.state when URL params exist', () => {
    const uri = '/edit/url-over-location';
    const locationState = {
      [SearchQueryParams.Query]: 'location query',
      [SearchQueryParams.Segment]: 'hubs',
    };

    setUpdatedGlobalState([
      {
        store: useSearchStore,
        updatedState: { navigationState: {} },
      },
    ]);
    const searchParams = new URLSearchParams({
      [SearchQueryParams.Query]: 'url query',
      [SearchQueryParams.Segment]: 'resources',
    });
    (useSearchParams as jest.Mock).mockReturnValue([searchParams]);
    (useLocation as jest.Mock).mockReturnValue({ state: locationState });

    const { result } = renderHook(() => useNavigateToEditPage());
    const { navigateToEditPage } = result.current;

    navigateToEditPage(uri);

    expect(mockNavigate).toHaveBeenCalledWith(uri, {
      state: {
        [SearchQueryParams.Query]: 'url query',
        [SearchQueryParams.Segment]: 'resources',
        isNavigatedFromLDE: true,
      },
    });
  });

  it('returns empty state when all sources are empty', () => {
    const uri = '/edit/empty-state';

    setUpdatedGlobalState([
      {
        store: useSearchStore,
        updatedState: { navigationState: {} },
      },
    ]);
    (useSearchParams as jest.Mock).mockReturnValue([new URLSearchParams()]);
    (useLocation as jest.Mock).mockReturnValue({ state: null });

    const { result } = renderHook(() => useNavigateToEditPage());
    const { navigateToEditPage } = result.current;

    navigateToEditPage(uri);

    expect(mockNavigate).toHaveBeenCalledWith(uri, {
      state: {
        isNavigatedFromLDE: true,
      },
    });
  });

  it('ignores location.state with only isNavigatedFromLDE flag', () => {
    const uri = '/edit/only-flag';
    const locationState = {
      isNavigatedFromLDE: true,
    };

    setUpdatedGlobalState([
      {
        store: useSearchStore,
        updatedState: { navigationState: {} },
      },
    ]);
    (useSearchParams as jest.Mock).mockReturnValue([new URLSearchParams()]);
    (useLocation as jest.Mock).mockReturnValue({ state: locationState });

    const { result } = renderHook(() => useNavigateToEditPage());
    const { navigateToEditPage } = result.current;

    navigateToEditPage(uri);

    expect(mockNavigate).toHaveBeenCalledWith(uri, {
      state: {
        isNavigatedFromLDE: true,
      },
    });
  });
});
