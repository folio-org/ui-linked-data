import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { EditSection } from '@/components/EditSection';
import { BibframeEntities } from '@/common/constants/bibframe.constants';
import { scrollEntity } from '@/common/helpers/pageScrolling.helper';
import { getResourceIdFromUri } from '@/common/helpers/navigation.helper';
import { useConfig } from '@/common/hooks/useConfig.hook';
import { useRecordControls } from '@/common/hooks/useRecordControls';
import { useResetRecordStatus } from '@/common/hooks/useResetRecordStatus';
import { UserNotificationFactory } from '@/common/services/userNotification';
import { StatusType } from '@/common/constants/status.constants';
import { RecordStatus } from '@/common/constants/record.constants';
import { EditPreview } from '@/components/EditPreview';
import { QueryParams } from '@/common/constants/routes.constants';
import { ViewMarcModal } from '@/components/ViewMarcModal';
import { useInputsState, useLoadingState, useMarcPreviewState, useStatusState, useUIState } from '@/store';
import { mapToResourceType, hasSplitLayout, getProfileBfid, hasReference, getReference } from '@/configs/resourceTypes';
import './Edit.scss';

const ignoreLoadingStatuses = [RecordStatus.saveAndClose, RecordStatus.saveAndKeepEditing];

export const Edit = () => {
  const { getProfiles } = useConfig();
  const { fetchRecord, clearRecordState, fetchRecordAndSelectEntityValues } = useRecordControls();
  const resourceId = getResourceIdFromUri();
  const { resetRecord, resetUserValues, resetSelectedEntries } = useInputsState([
    'resetRecord',
    'resetUserValues',
    'resetSelectedEntries',
  ]);
  const { recordStatus, addStatusMessagesItem } = useStatusState(['recordStatus', 'addStatusMessagesItem']);
  const { basicValue: marcPreviewData, resetBasicValue: resetMarcPreviewData } = useMarcPreviewState([
    'basicValue',
    'resetBasicValue',
  ]);
  const recordStatusType = recordStatus?.type;
  const { setIsLoading } = useLoadingState(['setIsLoading']);
  const { setCurrentlyEditedEntityBfid, setCurrentlyPreviewedEntityBfid, resetHasShownAuthorityWarning } = useUIState([
    'setCurrentlyEditedEntityBfid',
    'setCurrentlyPreviewedEntityBfid',
    'resetHasShownAuthorityWarning',
  ]);
  const [searchParams] = useSearchParams();
  const cloneOfParam = searchParams.get(QueryParams.CloneOf);
  const typeParam = searchParams.get(QueryParams.Type);
  const refParam = searchParams.get(QueryParams.Ref);

  const prevResourceId = useRef<string | null | undefined>(null);
  const prevCloneOf = useRef<string | null>(null);

  // Get resource type from URL parameter using registry
  const resourceType = mapToResourceType(typeParam);
  const showPreviewSection = hasSplitLayout(resourceType);

  function setEntitesBFIds() {
    const editedEntityBfId = getProfileBfid(resourceType);

    setCurrentlyEditedEntityBfid(new Set([editedEntityBfId]));

    // Only set preview entity if this type has a reference to another type
    if (hasReference(resourceType)) {
      const reference = getReference(resourceType);
      const previewedEntityBfId = getProfileBfid(reference?.targetType);

      setCurrentlyPreviewedEntityBfid(new Set([previewedEntityBfId]));
    } else {
      // No preview for standalone types like Hub
      setCurrentlyPreviewedEntityBfid(new Set());
    }
  }

  useResetRecordStatus();

  useEffect(() => {
    resetMarcPreviewData();

    scrollEntity({ top: 0, behavior: 'instant' });

    async function init() {
      if (resourceId ?? cloneOfParam ?? refParam) {
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

  // TODO: UILD-60, UILD-643 - refactor this after introducing Zustand selectors and React Query
  useEffect(() => {
    async function loadRecord() {
      if (!recordStatusType || ignoreLoadingStatuses.includes(recordStatusType)) return;

      const fetchableId = resourceId ?? cloneOfParam;

      if (
        (!cloneOfParam && resourceId && prevResourceId.current === resourceId) ||
        (cloneOfParam && prevCloneOf.current === cloneOfParam) ||
        (!fetchableId && !refParam)
      ) {
        return;
      }

      setIsLoading(true);

      try {
        if (fetchableId) {
          prevCloneOf.current = cloneOfParam;
          prevResourceId.current = resourceId;

          await fetchRecord(fetchableId);

          return;
        }

        const resourceReference = refParam;
        setEntitesBFIds();
        clearRecordState();

        let record: RecordEntry | null = null;

        if (resourceReference) {
          record = (await fetchRecordAndSelectEntityValues(
            resourceReference,
            resourceType.toUpperCase() as BibframeEntities,
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
          {showPreviewSection && <EditPreview />}
          <EditSection />
        </>
      )}
      <ViewMarcModal />
    </div>
  );
};
