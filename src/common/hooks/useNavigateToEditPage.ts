import { ROUTES, QueryParams } from '@common/constants/routes.constants';
import { useSearchState } from '@src/store';
import { useNavigate } from 'react-router-dom';

export const useNavigateToEditPage = () => {
  const navigate = useNavigate();
  const { navigationState } = useSearchState();

  const navigateAsDuplicate = (duplicateId: string) => {
    navigate(`${ROUTES.RESOURCE_CREATE.uri}?${QueryParams.CloneOf}=${duplicateId}`, { state: navigationState });
  };

  return {
    navigateToEditPage: (uri: string, { ...options } = {}) => navigate(uri, { state: navigationState, ...options }),
    navigateAsDuplicate,
  };
};
