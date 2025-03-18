import { renderHook } from '@testing-library/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useNavigateToEditPage } from '@common/hooks/useNavigateToEditPage';
import { setInitialGlobalState, setUpdatedGlobalState } from '@src/test/__mocks__/store';
import { useSearchStore } from '@src/store';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
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
    (useLocation as jest.Mock).mockReturnValue({ pathname: '/search' });

    const { result } = renderHook(() => useNavigateToEditPage());
    const { navigateToEditPage } = result.current;

    navigateToEditPage(uri);

    expect(navigate).toHaveBeenCalledWith(uri, { state: { ...navigationState, origin: '/search' } });
  });
});
