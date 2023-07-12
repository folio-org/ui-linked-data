import { Link } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import useConfig from '../../common/hooks/useConfig.hook';
import { EditSection } from '../../components/EditSection/EditSection';
import { Preview } from '../../components/Preview/Preview';
import { Properties } from '../../components/Properties/Properties';
import state from '../../state/state';
import './Edit.scss';
import { localStorageService } from '../../common/services/storage';
import { generateRecordBackupKey } from '../../common/helpers/progressBackup.helper';
import { PROFILE_IDS } from '../../common/constants/bibframe.constants';
import { DEFAULT_RECORD_ID } from '../../common/constants/storage.constants';

export const Edit = () => {
  const selectedProfile = useRecoilValue(state.config.selectedProfile);
  const setRecord = useSetRecoilState(state.inputs.record);

  const { getProfiles } = useConfig();

  const onClickStartFromScratch = () => {
    const key = generateRecordBackupKey();
    const savedRecordData = localStorageService.deserialize(key);
    // TODO: set selected profile
    const record = savedRecordData ? { id: DEFAULT_RECORD_ID, ...savedRecordData[PROFILE_IDS.MONOGRAPH] } : null;

    if (record) {
      setRecord(record);
    }

    getProfiles(record);
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
