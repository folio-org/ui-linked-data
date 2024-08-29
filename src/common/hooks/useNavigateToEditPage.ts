import { ROUTES, QueryParams } from '@common/constants/routes.constants';
import state from '@state';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

export const useNavigateToEditPage = () => {
  const navigate = useNavigate();
  const navigationState = useRecoilValue(state.search.navigationState);

  const navigateAsDuplicate = (duplicateId: string) => {
    navigate(`${ROUTES.RESOURCE_CREATE.uri}?${QueryParams.CloneOf}=${duplicateId}`, { state: navigationState });
  };

  return {
    navigateToEditPage: (uri: string, { ...options } = {}) => navigate(uri, { state: navigationState, ...options }),
    navigateAsDuplicate,
  };
};
