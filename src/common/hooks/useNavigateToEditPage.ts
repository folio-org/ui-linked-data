import { useNavigate } from 'react-router-dom';

import { QueryParams, ROUTES } from '@/common/constants/routes.constants';

import { useSearchState } from '@/store';

export const useNavigateToEditPage = () => {
  const navigate = useNavigate();
  const { navigationState } = useSearchState(['navigationState']);

  const navigateAsDuplicate = (duplicateId: string) => {
    navigate(`${ROUTES.RESOURCE_CREATE.uri}?${QueryParams.CloneOf}=${duplicateId}`, { state: navigationState });
  };

  return {
    navigateToEditPage: (uri: string, { ...options } = {}) =>
      navigate(uri, { state: { ...navigationState, isNavigatedFromLDE: true }, ...options }),
    navigateAsDuplicate,
  };
};
