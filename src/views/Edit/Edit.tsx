import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { EditSection } from '@components/EditSection';
import { Properties } from '@components/Properties';
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

export const Edit = () => {
  const setRecord = useSetRecoilState(state.inputs.record);
  const { getProfiles } = useConfig();
  const { fetchRecord, clearRecordState } = useRecordControls();
  const { resourceId } = useParams();
  const setIsLoading = useSetRecoilState(state.loadingState.isLoading);
  const setStatusMessages = useSetRecoilState(state.status.commonMessages);

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
      <Properties />
      <EditSection />
    </div>
  );
};
