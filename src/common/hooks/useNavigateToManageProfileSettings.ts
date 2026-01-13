import { ROUTES } from '@common/constants/routes.constants';
import { useSearchState } from '@src/store';
import { useNavigate } from 'react-router-dom';

export const useNavigateToManageProfileSettings = () => {
  const navigate = useNavigate();
  const { navigationState } = useSearchState(['navigationState']);

  return {
    navigateToManageProfileSettings: () =>
      navigate(ROUTES.MANAGE_PROFILE_SETTINGS.uri, { state: { ...navigationState, isNavigatedFromLDE: true } }),
  };
};
