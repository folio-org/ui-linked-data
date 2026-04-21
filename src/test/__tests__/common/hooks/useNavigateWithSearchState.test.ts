import { setInitialGlobalState, setUpdatedGlobalState } from '@/test/__mocks__/store';

import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { renderHook } from '@testing-library/react';

import { SearchQueryParams } from '@/common/constants/routes.constants';
import { useNavigateWithSearchState } from '@/common/hooks/useNavigateWithSearchState';

import { useSearchStore } from '@/store';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  useSearchParams: jest.fn(),
  useLocation: jest.fn(),
}));

describe('useNavigateWithSearchState', () => {
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

  describe('navigateWithState', () => {
    it('Navigates with navigation state from store', () => {
      const uri = '/test/page';
      const navigationState = {
        [SearchQueryParams.Query]: 'test query',
        [SearchQueryParams.Segment]: 'hubs',
      };
      setUpdatedGlobalState([
        {
          store: useSearchStore,
          updatedState: { navigationState: navigationState as SearchParamsState },
        },
      ]);
      (useSearchParams as jest.Mock).mockReturnValue([new URLSearchParams()]);

      const { result } = renderHook(() => useNavigateWithSearchState());
      const { navigateWithState } = result.current;

      navigateWithState(uri);

      expect(mockNavigate).toHaveBeenCalledWith(uri, {
        state: { ...navigationState, isNavigatedFromLDE: true },
      });
    });

    it('Navigates with state from URL params when store is empty', () => {
      const uri = '/test/page';
      setUpdatedGlobalState([
        {
          store: useSearchStore,
          updatedState: { navigationState: {} },
        },
      ]);

      const searchParams = new URLSearchParams({
        [SearchQueryParams.Query]: 'url query',
        [SearchQueryParams.SearchBy]: 'title',
        [SearchQueryParams.Segment]: 'resources',
      });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      const { result } = renderHook(() => useNavigateWithSearchState());
      const { navigateWithState } = result.current;

      navigateWithState(uri);

      expect(mockNavigate).toHaveBeenCalledWith(uri, {
        state: {
          [SearchQueryParams.Query]: 'url query',
          [SearchQueryParams.SearchBy]: 'title',
          [SearchQueryParams.Segment]: 'resources',
          isNavigatedFromLDE: true,
        },
      });
    });

    it('Navigates with location state when store and URL are empty', () => {
      const uri = '/test/page';
      const locationState = {
        [SearchQueryParams.Query]: 'location query',
        [SearchQueryParams.Segment]: 'hubs',
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

      const { result } = renderHook(() => useNavigateWithSearchState());
      const { navigateWithState } = result.current;

      navigateWithState(uri);

      expect(mockNavigate).toHaveBeenCalledWith(uri, {
        state: {
          [SearchQueryParams.Query]: 'location query',
          [SearchQueryParams.Segment]: 'hubs',
          isNavigatedFromLDE: true,
        },
      });
    });

    it('Navigates with empty state when all sources are empty', () => {
      const uri = '/test/page';

      setUpdatedGlobalState([
        {
          store: useSearchStore,
          updatedState: { navigationState: {} },
        },
      ]);
      (useSearchParams as jest.Mock).mockReturnValue([new URLSearchParams()]);
      (useLocation as jest.Mock).mockReturnValue({ state: null });

      const { result } = renderHook(() => useNavigateWithSearchState());
      const { navigateWithState } = result.current;

      navigateWithState(uri);

      expect(mockNavigate).toHaveBeenCalledWith(uri, {
        state: {
          isNavigatedFromLDE: true,
        },
      });
    });

    it('Navigates with additional options', () => {
      const uri = '/test/page';
      const navigationState = {
        [SearchQueryParams.Query]: 'test',
      };
      setUpdatedGlobalState([
        {
          store: useSearchStore,
          updatedState: { navigationState: navigationState as SearchParamsState },
        },
      ]);
      (useSearchParams as jest.Mock).mockReturnValue([new URLSearchParams()]);

      const { result } = renderHook(() => useNavigateWithSearchState());
      const { navigateWithState } = result.current;

      navigateWithState(uri, { replace: true });

      expect(mockNavigate).toHaveBeenCalledWith(uri, {
        state: { ...navigationState, isNavigatedFromLDE: true },
        replace: true,
      });
    });

    it('Handles all query params from URL', () => {
      const uri = '/test/page';
      setUpdatedGlobalState([
        {
          store: useSearchStore,
          updatedState: { navigationState: {} },
        },
      ]);

      const searchParams = new URLSearchParams({
        [SearchQueryParams.Query]: 'full query',
        [SearchQueryParams.SearchBy]: 'lccn',
        [SearchQueryParams.Segment]: 'hubs',
        [SearchQueryParams.Source]: 'libraryOfCongress',
        [SearchQueryParams.Offset]: '20',
      });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      const { result } = renderHook(() => useNavigateWithSearchState());
      const { navigateWithState } = result.current;

      navigateWithState(uri);

      expect(mockNavigate).toHaveBeenCalledWith(uri, {
        state: {
          [SearchQueryParams.Query]: 'full query',
          [SearchQueryParams.SearchBy]: 'lccn',
          [SearchQueryParams.Segment]: 'hubs',
          [SearchQueryParams.Source]: 'libraryOfCongress',
          [SearchQueryParams.Offset]: '20',
          isNavigatedFromLDE: true,
        },
      });
    });
  });

  describe('getNavigationState', () => {
    it('Gets navigation state from store', () => {
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
      (useSearchParams as jest.Mock).mockReturnValue([new URLSearchParams()]);

      const { result } = renderHook(() => useNavigateWithSearchState());
      const { getNavigationState } = result.current;

      const state = getNavigationState();

      expect(state).toEqual(navigationState);
    });

    it('Gets navigation state from URL when store is empty', () => {
      setUpdatedGlobalState([
        {
          store: useSearchStore,
          updatedState: { navigationState: {} },
        },
      ]);

      const searchParams = new URLSearchParams({
        [SearchQueryParams.Query]: 'url query',
        [SearchQueryParams.Segment]: 'hubs',
      });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      const { result } = renderHook(() => useNavigateWithSearchState());
      const { getNavigationState } = result.current;

      const state = getNavigationState();

      expect(state).toEqual({
        [SearchQueryParams.Query]: 'url query',
        [SearchQueryParams.Segment]: 'hubs',
      });
    });

    it('Gets empty state when all sources are empty', () => {
      setUpdatedGlobalState([
        {
          store: useSearchStore,
          updatedState: { navigationState: {} },
        },
      ]);
      (useSearchParams as jest.Mock).mockReturnValue([new URLSearchParams()]);
      (useLocation as jest.Mock).mockReturnValue({ state: null });

      const { result } = renderHook(() => useNavigateWithSearchState());
      const { getNavigationState } = result.current;

      const state = getNavigationState();

      expect(state).toEqual({});
    });
  });
});
