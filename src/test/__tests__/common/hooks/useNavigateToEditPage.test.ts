import { setInitialGlobalState, setUpdatedGlobalState } from '@/test/__mocks__/store';

import { useNavigate } from 'react-router-dom';

import { renderHook } from '@testing-library/react';

import { useNavigateToEditPage } from '@/common/hooks/useNavigateToEditPage';

import { useSearchStore } from '@/store';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('useNavigateToEditPage', () => {
  beforeEach(() => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: { navigationState: {} },
      },
    ]);
  });

  it('navigates to Edit page with navigation state', () => {
    const uri = '/edit/123';
    const navigate = jest.fn();
    const navigationState = { some: 'state' };
    setUpdatedGlobalState([
      {
        store: useSearchStore,
        updatedState: { navigationState: navigationState as SearchParamsState },
      },
    ]);

    (useNavigate as jest.Mock).mockReturnValue(navigate);

    const { result } = renderHook(() => useNavigateToEditPage());
    const { navigateToEditPage } = result.current;

    navigateToEditPage(uri);

    expect(navigate).toHaveBeenCalledWith(uri, { state: { ...navigationState, isNavigatedFromLDE: true } });
  });
});
