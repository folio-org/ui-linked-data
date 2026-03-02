import { ROUTES } from '@/common/constants/routes.constants';
import { useNavigateWithSearchState } from '@/common/hooks/useNavigateWithSearchState';

export const useNavigateToManageProfileSettings = () => {
  const { navigateWithState } = useNavigateWithSearchState();

  return {
    navigateToManageProfileSettings: () => navigateWithState(ROUTES.MANAGE_PROFILE_SETTINGS.uri),
  };
};
