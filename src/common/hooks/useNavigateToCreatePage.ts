import { QueryParams, ROUTES } from '@common/constants/routes.constants';
import { useNavigateToEditPage } from './useNavigateToEditPage';
import { useProfileSelection } from './useProfileSelection';
import { useNavigationState } from '@src/store';
import { generatePageURL } from '@common/helpers/navigation.helper';
import { useRef } from 'react';

export const useNavigateToCreatePage = () => {
  const { navigateToEditPage } = useNavigateToEditPage();
  const { checkProfileAndProceed } = useProfileSelection();
  const { setQueryParams } = useNavigationState();
  const queryParamsRef = useRef<{ type?: string | null; refId?: string | null }>({
    type: undefined,
    refId: undefined,
  });
  const navigationStateRef = useRef<SearchParamsState>();

  const createQueryParams = ({ type, refId }: { type: string; refId: string }): Record<QueryParams, string> | null => {
    if (!type || !refId) return null;

    return {
      [QueryParams.Type]: type,
      [QueryParams.Ref]: refId,
    } as Record<QueryParams, string>;
  };

  const handleProfileSelection = (profileId: string): void => {
    if (!queryParamsRef.current.type || !queryParamsRef.current.refId) return;

    const params = createQueryParams({
      type: queryParamsRef.current.type,
      refId: queryParamsRef.current.refId,
    });

    if (params) {
      const url = generatePageURL({
        url: ROUTES.RESOURCE_CREATE.uri,
        queryParams: params,
        profileId,
      });

      navigateToEditPage(url, navigationStateRef.current);
    }
  };

  const onCreateNewResource = ({
    resourceTypeURL,
    queryParams,
    navigationState,
  }: {
    resourceTypeURL: string;
    queryParams: { type?: string | null; refId?: string | null };
    navigationState?: SearchParamsState;
  }): void => {
    const params =
      queryParams.type && queryParams.refId
        ? createQueryParams({ type: queryParams.type, refId: queryParams.refId })
        : null;

    queryParamsRef.current = queryParams;
    navigationStateRef.current = navigationState;

    if (params) {
      setQueryParams(params);
    }

    checkProfileAndProceed({
      resourceTypeURL,
      callback: handleProfileSelection,
    });
  };

  return { onCreateNewResource };
};
