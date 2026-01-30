import { useRef } from 'react';

import { QueryParams, ROUTES } from '@/common/constants/routes.constants';
import { generatePageURL } from '@/common/helpers/navigation.helper';

import { useNavigationState } from '@/store';

import { useNavigateToEditPage } from './useNavigateToEditPage';
import { useProfileSelection } from './useProfileSelection';

export const useNavigateToCreatePage = () => {
  const { navigateToEditPage } = useNavigateToEditPage();
  const { checkProfileAndProceed } = useProfileSelection();
  const { setQueryParams } = useNavigationState(['setQueryParams']);

  // References to store query parameters and navigation state for later use
  const queryParamsRef = useRef<{ type?: string | null; refId?: string | null }>({
    type: undefined,
    refId: undefined,
  });
  const navigationStateRef = useRef<SearchParamsState | undefined>(undefined);

  // Creates query parameters object for resource creation
  const createQueryParams = ({ type, refId }: { type: string; refId?: string | null }) => {
    if (!type) return null;

    const queryParams = {
      [QueryParams.Type]: type,
    } as Record<QueryParams, string>;

    if (refId) {
      queryParams[QueryParams.Ref] = refId;
    }

    return queryParams;
  };

  // Handles navigation after profile selection
  const handleProfileSelection = (profileId: string | number) => {
    if (!queryParamsRef.current.type) return;

    const params = createQueryParams({
      type: queryParamsRef.current.type,
      refId: queryParamsRef.current.refId ?? null,
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

  // Initiates the resource creation process with profile selection
  const onCreateNewResource = ({
    resourceTypeURL,
    queryParams,
    navigationState,
  }: {
    resourceTypeURL: ResourceTypeURL;
    queryParams: { type?: string | null; refId?: string | null };
    navigationState?: SearchParamsState;
  }) => {
    const params = queryParams.type ? createQueryParams({ type: queryParams.type, refId: queryParams.refId }) : null;

    // Store current query parameters and navigation state for later use
    queryParamsRef.current = queryParams;
    navigationStateRef.current = navigationState;

    if (params) {
      setQueryParams(params);
    }

    // Check for profile and proceed with resource creation
    checkProfileAndProceed({
      resourceTypeURL,
      callback: handleProfileSelection,
    });
  };

  return { onCreateNewResource };
};
