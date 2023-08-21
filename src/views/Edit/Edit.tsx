import { Link } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import state from '@state';
import useConfig from '@common/hooks/useConfig.hook';
import { PROFILE_IDS } from '@common/constants/bibframe.constants';
import { DEFAULT_RECORD_ID } from '@common/constants/storage.constants';
import { getSavedRecord } from '@common/helpers/record.helper';
import { EditSection } from '@components/EditSection';
import { Preview } from '@components/Preview';
import { Properties } from '@components/Properties';
import './Edit.scss';
import { FormattedMessage, useIntl } from 'react-intl';

export const Edit = () => {
  const selectedProfile = useRecoilValue(state.config.selectedProfile);
  const setRecord = useSetRecoilState(state.inputs.record);
  const { getProfiles } = useConfig();
  const { formatMessage } = useIntl();

  const onClickStartFromScratch = () => {
    // TODO: set default selected profile
    const defaultProfile = PROFILE_IDS.MONOGRAPH;
    const profile = selectedProfile?.id ?? defaultProfile;
    const savedRecordData = getSavedRecord(profile);
    const record = savedRecordData
      ? { id: DEFAULT_RECORD_ID, profile: defaultProfile, ...savedRecordData.data?.[defaultProfile] }
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
      <FormattedMessage
        id="marva.select-or-start-from-scratch"
        values={{
          select: <Link to="/load">{formatMessage({ id: 'marva.select-for-editing' })}</Link>,
          startFromScratch: (
            <Link to="#" onClick={onClickStartFromScratch}>
              {formatMessage({ id: 'marva.start-from-scratch' })}
            </Link>
          ),
        }}
      />
    </div>
  );
};
