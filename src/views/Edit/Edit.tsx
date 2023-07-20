import { Link } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import useConfig from '@hooks/useConfig.hook';
import { EditSection } from '@components/EditSection';
import { Preview } from '@components/Preview';
import { Properties } from '@components/Properties';
import state from '@state';
import { PROFILE_IDS } from '@constants/bibframe.constants';
import { DEFAULT_RECORD_ID } from '@constants/storage.constants';
import { getSavedRecord } from '@helpers/record.helper';
import './Edit.scss';

export const Edit = () => {
  const selectedProfile = useRecoilValue(state.config.selectedProfile);
  const setRecord = useSetRecoilState(state.inputs.record);
  const { getProfiles } = useConfig();

  const onClickStartFromScratch = () => {
    // TODO: set default selected profile
    const defaultProfile = PROFILE_IDS.MONOGRAPH;
    const profile = selectedProfile?.id ?? defaultProfile;
    const savedRecordData = getSavedRecord(profile);
    const record = savedRecordData
      ? { id: DEFAULT_RECORD_ID, profile: defaultProfile, ...savedRecordData.data[defaultProfile] }
      : null;
    const typedRecord = record as unknown as RecordEntry;

    typedRecord && setRecord(typedRecord);
    getProfiles(typedRecord);
  };

  return selectedProfile ? (
    <div className="edit-page">
      <Properties />
      <EditSection />
      <Preview />
    </div>
  ) : (
    <div>
      <Link to="/load">Select a record for editing</Link> or{' '}
      <Link to="#" onClick={onClickStartFromScratch}>
        Start from scratch
      </Link>
    </div>
  );
};
