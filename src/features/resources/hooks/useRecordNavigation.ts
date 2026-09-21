import { useNavigate, useSearchParams } from 'react-router-dom';

import { RecordStatus } from '@/common/constants/record.constants';
import { QueryParams, SearchQueryParams } from '@/common/constants/routes.constants';
import { StatusType } from '@/common/constants/status.constants';
import { getFriendlyErrorMessage } from '@/common/helpers/api.helper';
import { generateEditResourceUrl } from '@/common/helpers/navigation.helper';
import { useBackToSearchUri } from '@/common/hooks/useBackToSearchUri';
import { useContainerEvents } from '@/common/hooks/useContainerEvents';
import { UserNotificationFactory } from '@/common/services/userNotification';
import { getSearchSegment, mapToResourceType } from '@/configs/resourceTypes';

import { getGraphIdByExternalId } from '@/features/resources';

import { useInputsState, useLoadingState, useProfileState, useStatusState } from '@/store';

export const useRecordNavigation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchResultsUri = useBackToSearchUri();
  const { resetUserValues, setRecord, setSelectedRecordBlocks } = useInputsState([
    'resetUserValues',
    'setRecord',
    'setSelectedRecordBlocks',
  ]);
  const { setSelectedProfile, resetSelectedProfileSettingsId } = useProfileState([
    'setSelectedProfile',
    'resetSelectedProfileSettingsId',
  ]);
  const { setRecordStatus, addStatusMessagesItem } = useStatusState(['setRecordStatus', 'addStatusMessagesItem']);
  const { setIsLoading } = useLoadingState(['setIsLoading']);
  const { dispatchUnblockEvent, dispatchNavigateToOriginEventWithFallback } = useContainerEvents();

  const ensureSegmentInUri = (uri: string) => {
    if (uri.includes(`${SearchQueryParams.Segment}=`)) {
      return uri;
    }

    const typeParam = searchParams.get(QueryParams.Type);
    const resourceType = mapToResourceType(typeParam);
    const segment = getSearchSegment(resourceType);
    const separator = uri.includes('?') ? '&' : '?';

    return `${uri}${separator}${SearchQueryParams.Segment}=${segment}`;
  };

  const clearRecordState = () => {
    resetUserValues();
    setRecord(null);
    setSelectedRecordBlocks(undefined);
    setSelectedProfile(null);
    resetSelectedProfileSettingsId();
    setRecordStatus({ type: RecordStatus.close });
    dispatchUnblockEvent();
  };

  const discardRecord = (clearState = true) => {
    if (clearState) clearRecordState();

    dispatchNavigateToOriginEventWithFallback(ensureSegmentInUri(searchResultsUri));
  };

  const tryFetchExternalRecordForEdit = async (recordId?: string) => {
    try {
      if (!recordId) return;

      setIsLoading(true);

      const { id } = await getGraphIdByExternalId({ recordId });

      if (id) {
        navigate(generateEditResourceUrl(id), { replace: true });
      }
    } catch (err: unknown) {
      addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.error, getFriendlyErrorMessage(err)));
    } finally {
      setIsLoading(false);
    }
  };

  return { clearRecordState, discardRecord, tryFetchExternalRecordForEdit };
};
