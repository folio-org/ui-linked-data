import { setInitialGlobalState, setUpdatedGlobalState } from '@/test/__mocks__/store';

import { useNavigate, useSearchParams } from 'react-router-dom';

import { renderHook } from '@testing-library/react';

import { SearchQueryParams } from '@/common/constants/routes.constants';
import { useNavigateToEditPage } from '@/common/hooks/useNavigateToEditPage';

import { useSearchStore } from '@/store';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe('useNavigateToEditPage', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
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
});
