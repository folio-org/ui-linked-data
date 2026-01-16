import { ROUTES } from '@common/constants/routes.constants';
import { useNavigate } from 'react-router-dom';

export const useNavigateToManageProfileSettings = () => {
  const navigate = useNavigate();

  return {
    navigateToManageProfileSettings: () =>
      navigate(ROUTES.MANAGE_PROFILE_SETTINGS.uri),
  };
};
