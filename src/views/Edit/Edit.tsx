import { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { EditSection } from '@components/EditSection';
import { BibframeEntities, PROFILE_BFIDS } from '@common/constants/bibframe.constants';
import { DEFAULT_RECORD_ID } from '@common/constants/storage.constants';
import { getSavedRecord, getRecordWithUpdatedID } from '@common/helpers/record.helper';
import { scrollEntity } from '@common/helpers/pageScrolling.helper';
import { useConfig } from '@common/hooks/useConfig.hook';
import { useRecordControls } from '@common/hooks/useRecordControls';
import { useResetRecordStatus } from '@common/hooks/useResetRecordStatus';
import { UserNotificationFactory } from '@common/services/userNotification';
import { StatusType } from '@common/constants/status.constants';
import { RecordStatus, ResourceType } from '@common/constants/record.constants';
import { EditPreview } from '@components/EditPreview';
import { QueryParams } from '@common/constants/routes.constants';
import { ViewMarcModal } from '@components/ViewMarcModal';
import { useMarcPreviewStore, useStatusStore } from '@src/store';
import state from '@state';
import './Edit.scss';

const ignoreLoadingStatuses = [RecordStatus.saveAndClose, RecordStatus.saveAndKeepEditing];

export const Edit = () => {
  const { getProfiles } = useConfig();
  const { fetchRecord, clearRecordState, fetchRecordAndSelectEntityValues } = useRecordControls();
  const { resourceId } = useParams();
  const { recordStatus, addStatusMessages } = useStatusStore();
  const { value: marcPreviewData, resetValue: resetMarcPreviewData } = useMarcPreviewStore();
  const recordStatusType = recordStatus?.type;
  const setIsLoading = useSetRecoilState(state.loadingState.isLoading);
  const setCurrentlyEditedEntityBfid = useSetRecoilState(state.ui.currentlyEditedEntityBfid);
  const setCurrentlyPreviewedEntityBfid = useSetRecoilState(state.ui.currentlyPreviewedEntityBfid);
  const [queryParams] = useSearchParams();

  useResetRecordStatus();

  useEffect(() => {
    resetMarcPreviewData();

    scrollEntity({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    async function loadRecord() {
      if (!recordStatusType || ignoreLoadingStatuses.includes(recordStatusType)) return;

      setIsLoading(true);

      const cloneId = queryParams.get(QueryParams.CloneOf);
      const fetchableId = resourceId ?? cloneId;

      try {
        if (fetchableId) {
          await fetchRecord(fetchableId);

          return;
        }

        const resourceDecriptionType = (queryParams.get(QueryParams.Type) as ResourceType) || ResourceType.instance;
        const resourceReference = queryParams.get(QueryParams.Ref);
        const isInstancePageType = resourceDecriptionType === ResourceType.instance;
        const editedEntityBfId = isInstancePageType ? PROFILE_BFIDS.INSTANCE : PROFILE_BFIDS.WORK;
        const previewedEntityBfId = isInstancePageType ? PROFILE_BFIDS.WORK : PROFILE_BFIDS.INSTANCE;

        setCurrentlyEditedEntityBfid(new Set([editedEntityBfId]));
        setCurrentlyPreviewedEntityBfid(new Set([previewedEntityBfId]));

        clearRecordState();

        const profile = PROFILE_BFIDS.MONOGRAPH;
        const savedRecordData = getSavedRecord(profile);
        const typedSavedRecord = savedRecordData ? (savedRecordData.data as RecordEntry) : null;
        let record = typedSavedRecord
          ? getRecordWithUpdatedID(typedSavedRecord, DEFAULT_RECORD_ID)
          : (null as unknown as RecordEntry);

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
        addStatusMessages(UserNotificationFactory.createMessage(StatusType.error, 'ld.errorLoadingResource'));
      } finally {
        setIsLoading(false);
      }
    }

    loadRecord();
  }, [resourceId, recordStatusType, queryParams]);

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
