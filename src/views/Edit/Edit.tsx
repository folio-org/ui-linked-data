import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { EditSection } from '@components/EditSection';
import { Properties } from '@components/Properties';
import { PROFILE_BFIDS } from '@common/constants/bibframe.constants';
import { DEFAULT_RECORD_ID } from '@common/constants/storage.constants';
import { getSavedRecord, getRecordWithUpdatedID } from '@common/helpers/record.helper';
import { useConfig } from '@common/hooks/useConfig.hook';
import { useRecordControls } from '@common/hooks/useRecordControls';
import state from '@state';
import './Edit.scss';

export const Edit = () => {
  const setRecord = useSetRecoilState(state.inputs.record);
  const { getProfiles } = useConfig();
  const { fetchRecord } = useRecordControls();
  const { resourceId } = useParams();

  useEffect(() => {
    // first case is for embedded mode, second is for standalone mode
    (document.getElementById('ModuleContainer') || document.getElementById('editor-root'))?.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    if (resourceId) {
      fetchRecord(resourceId);

      return;
    }

    const profile = PROFILE_BFIDS.MONOGRAPH;
    const savedRecordData = getSavedRecord(profile);
    const typedSavedRecord = savedRecordData ? (savedRecordData.data as RecordEntry) : null;
    const record = typedSavedRecord ? getRecordWithUpdatedID(typedSavedRecord, DEFAULT_RECORD_ID) : null;
    const typedRecord = record as unknown as RecordEntry;

    typedRecord && setRecord(typedRecord);
    getProfiles({ record: typedRecord });
  }, [resourceId]);

  return (
    <div data-testid="edit-page" className="edit-page">
      <Properties />
      <EditSection />
    </div>
  );
};
