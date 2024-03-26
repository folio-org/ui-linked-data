import { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { EditSection } from '@components/EditSection';
import { Preview } from '@components/Preview';
import { PROFILE_BFIDS } from '@common/constants/bibframe.constants';
import { DEFAULT_RECORD_ID } from '@common/constants/storage.constants';
import { getSavedRecord, getRecordWithUpdatedID } from '@common/helpers/record.helper';
import { scrollEntity } from '@common/helpers/pageScrolling.helper';
import { useConfig } from '@common/hooks/useConfig.hook';
import { useRecordControls } from '@common/hooks/useRecordControls';
import { UserNotificationFactory } from '@common/services/userNotification';
import { StatusType } from '@common/constants/status.constants';
import state from '@state';
import './Edit.scss';
import { ResourceType } from '@common/constants/record.constants';

export const Edit = () => {
  const setRecord = useSetRecoilState(state.inputs.record);
  const { getProfiles } = useConfig();
  const { fetchRecord, clearRecordState } = useRecordControls();
  const { resourceId } = useParams();
  const [searchParams] = useSearchParams();
  const setIsLoading = useSetRecoilState(state.loadingState.isLoading);
  const setStatusMessages = useSetRecoilState(state.status.commonMessages);
  const setCurrentlyEditedEntityBfid = useSetRecoilState(state.ui.currentlyEditedEntityBfid);
  const setCurrentlyPreviewedEntityBfid = useSetRecoilState(state.ui.currentlyPreviewedEntityBfid);

  useEffect(() => {
    scrollEntity({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    async function loadRecord() {
      setIsLoading(true);

      try {
        if (resourceId) {
          await fetchRecord(resourceId);
          return;
        }

        const isWorkPageType = searchParams?.get('type') === ResourceType.work;
        const editedEntityBfId = isWorkPageType ? PROFILE_BFIDS.WORK : PROFILE_BFIDS.INSTANCE;
        const previewedEntityBfId = isWorkPageType ? PROFILE_BFIDS.INSTANCE : PROFILE_BFIDS.WORK;

        setCurrentlyEditedEntityBfid(new Set([editedEntityBfId]));
        setCurrentlyPreviewedEntityBfid(new Set([previewedEntityBfId]));

        clearRecordState();

        const profile = PROFILE_BFIDS.MONOGRAPH;
        const savedRecordData = getSavedRecord(profile);
        const typedSavedRecord = savedRecordData ? (savedRecordData.data as RecordEntry) : null;
        const record = typedSavedRecord ? getRecordWithUpdatedID(typedSavedRecord, DEFAULT_RECORD_ID) : null;
        const typedRecord = record as unknown as RecordEntry;

        typedRecord && setRecord(typedRecord);
        await getProfiles({ record: typedRecord });
      } catch {
        setStatusMessages(currentStatus => [
          ...currentStatus,
          UserNotificationFactory.createMessage(StatusType.error, 'marva.errorLoadingResource'),
        ]);
      } finally {
        setIsLoading(false);
      }
    }

    loadRecord();
  }, [resourceId]);

  return (
    <div data-testid="edit-page" className="edit-page">
      <Preview headless />
      <EditSection />
    </div>
  );
};
