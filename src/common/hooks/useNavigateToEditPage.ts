import { ROUTES, QueryParams } from '@common/constants/routes.constants';
import { useSearchState } from '@src/store';
import { useLocation, useNavigate } from 'react-router-dom';

export const useNavigateToEditPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { navigationState } = useSearchState();

  const navigateAsDuplicate = (duplicateId: string) => {
    navigate(`${ROUTES.RESOURCE_CREATE.uri}?${QueryParams.CloneOf}=${duplicateId}`, { state: navigationState });
  };

  return {
    navigateToEditPage: (uri: string, { ...options } = {}) =>
      navigate(uri, { state: { ...navigationState, origin: location.pathname }, ...options }),
    navigateAsDuplicate,
  };
};
