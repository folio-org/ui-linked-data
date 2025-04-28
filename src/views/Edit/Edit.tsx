import { useEffect, useRef } from 'react';
import { EditSection } from '@components/EditSection';
import { BibframeEntities, PROFILE_BFIDS } from '@common/constants/bibframe.constants';
import { scrollEntity } from '@common/helpers/pageScrolling.helper';
import { getResourceIdFromUri } from '@common/helpers/navigation.helper';
import { useConfig } from '@common/hooks/useConfig.hook';
import { useRecordControls } from '@common/hooks/useRecordControls';
import { useResetRecordStatus } from '@common/hooks/useResetRecordStatus';
import { UserNotificationFactory } from '@common/services/userNotification';
import { StatusType } from '@common/constants/status.constants';
import { RecordStatus, ResourceType } from '@common/constants/record.constants';
import { EditPreview } from '@components/EditPreview';
import { QueryParams } from '@common/constants/routes.constants';
import { ViewMarcModal } from '@components/ViewMarcModal';
import { useInputsState, useLoadingState, useMarcPreviewState, useStatusState, useUIState } from '@src/store';
import './Edit.scss';

const ignoreLoadingStatuses = [RecordStatus.saveAndClose, RecordStatus.saveAndKeepEditing];

export const Edit = () => {
  const { getProfiles } = useConfig();
  const { fetchRecord, clearRecordState, fetchRecordAndSelectEntityValues } = useRecordControls();
  const resourceId = getResourceIdFromUri();
  const { resetRecord, resetUserValues, resetSelectedEntries } = useInputsState();
  const { recordStatus, addStatusMessagesItem } = useStatusState();
  const { basicValue: marcPreviewData, resetBasicValue: resetMarcPreviewData } = useMarcPreviewState();
  const recordStatusType = recordStatus?.type;
  const { setIsLoading } = useLoadingState();
  const { setCurrentlyEditedEntityBfid, setCurrentlyPreviewedEntityBfid, resetHasShownAuthorityWarning } = useUIState();
  const queryParams = new URLSearchParams(window.location.search);
  const cloneOfParam = queryParams.get(QueryParams.CloneOf);
  const typeParam = queryParams.get(QueryParams.Type);
  const refParam = queryParams.get(QueryParams.Ref);

  const prevResourceId = useRef<string | null>(null);
  const prevCloneOf = useRef<string | null>(null);

  function setEntitesBFIds() {
    const resourceDecriptionType = (typeParam as ResourceType) || ResourceType.instance;
    const isInstancePageType = resourceDecriptionType === ResourceType.instance;
    const editedEntityBfId = isInstancePageType ? PROFILE_BFIDS.INSTANCE : PROFILE_BFIDS.WORK;
    const previewedEntityBfId = isInstancePageType ? PROFILE_BFIDS.WORK : PROFILE_BFIDS.INSTANCE;

    setCurrentlyEditedEntityBfid(new Set([editedEntityBfId]));
    setCurrentlyPreviewedEntityBfid(new Set([previewedEntityBfId]));
  }

  useResetRecordStatus();

  useEffect(() => {
    resetMarcPreviewData();

    scrollEntity({ top: 0, behavior: 'instant' });

    async function init() {
      if (resourceId ?? cloneOfParam) {
        return;
      }

      try {
        setIsLoading(true);
        await getProfiles({});
        setEntitesBFIds();
      } catch {
        addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.error, 'ld.errorFetching'));
      } finally {
        setIsLoading(false);
      }
    }

    init();

    return () => {
      resetRecord();
      resetUserValues();
      resetSelectedEntries();
      resetHasShownAuthorityWarning();
    };
  }, []);

  useEffect(() => {
    resetHasShownAuthorityWarning();
  }, [resourceId]);

  useEffect(() => {
    async function loadRecord() {
      if (!recordStatusType || ignoreLoadingStatuses.includes(recordStatusType)) return;

      const fetchableId = resourceId ?? cloneOfParam;

      if (
        (!cloneOfParam && fetchableId && prevResourceId.current === fetchableId) ||
        (cloneOfParam && prevCloneOf.current === cloneOfParam) ||
        (!fetchableId && !refParam)
      ) {
        return;
      }

      setIsLoading(true);

      try {
        if (fetchableId) {
          prevCloneOf.current = cloneOfParam;
          prevResourceId.current = fetchableId;

          await fetchRecord(fetchableId);

          return;
        }

        const resourceDecriptionType = (typeParam as ResourceType) || ResourceType.instance;
        const resourceReference = refParam;
        setEntitesBFIds();
        clearRecordState();

        let record: RecordEntry | null = null;

        if (resourceReference) {
          record = (await fetchRecordAndSelectEntityValues(
            resourceReference,
            resourceDecriptionType.toUpperCase() as BibframeEntities,
          )) as RecordEntry;
        }

        const typedRecord = record as unknown as RecordEntry;

        await getProfiles({
          record: typedRecord,
        });
      } catch {
        addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.error, 'ld.errorLoadingResource'));
      } finally {
        setIsLoading(false);
      }
    }

    loadRecord();
  }, [resourceId, recordStatusType, cloneOfParam, typeParam, refParam]);

  return (
    <div data-testid="edit-page" className="edit-page">
      {!marcPreviewData && (
        <>
          <EditPreview />
          <EditSection />
        </>
      )}
      <ViewMarcModal />
    </div>
  );
};
