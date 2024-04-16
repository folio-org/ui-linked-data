import { renderHook } from '@testing-library/react';
import { useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { useNavigateToEditPage } from '@common/hooks/useNavigateToEditPage';

jest.mock('@state', () => ({
  default: {
    search: {
      navigationState: {},
    },
  },
}));
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));
jest.mock('recoil', () => ({
  useRecoilValue: jest.fn(),
}));

describe('useNavigateToEditPage', () => {
  it('navigates to Edit page with navigation state', () => {
    const uri = '/edit/123';
    const navigate = jest.fn();
    const navigationState = { some: 'state' };

    (useNavigate as jest.Mock).mockReturnValue(navigate);
    (useRecoilValue as jest.Mock).mockReturnValue(navigationState);

    const { result } = renderHook(() => useNavigateToEditPage());
    const { navigateToEditPage } = result.current;

    navigateToEditPage(uri);

    expect(navigate).toHaveBeenCalledWith(uri, { state: navigationState });
  });
});
