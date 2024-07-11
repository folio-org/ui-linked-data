import state from '@state';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

export const useNavigateToEditPage = () => {
  const navigate = useNavigate();
  const navigationState = useRecoilValue(state.search.navigationState);

  return {
    navigateToEditPage: (uri: string, { ...options } = {}) => navigate(uri, { state: navigationState, ...options }),
  };
};
