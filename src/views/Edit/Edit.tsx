import { Link } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import state from '@state';
import { useConfig } from '@common/hooks/useConfig.hook';
import { PROFILE_IDS } from '@common/constants/bibframe.constants';
import { DEFAULT_RECORD_ID } from '@common/constants/storage.constants';
import { getSavedRecord, getRecordWithUpdatedID } from '@common/helpers/record.helper';
import { EditSection } from '@components/EditSection';
import { Properties } from '@components/Properties';
import './Edit.scss';
import { FormattedMessage, useIntl } from 'react-intl';
import { useEffect } from 'react';

export const Edit = () => {
  const selectedProfile = useRecoilValue(state.config.selectedProfile);
  const setRecord = useSetRecoilState(state.inputs.record);
  const { getProfiles } = useConfig();
  const { formatMessage } = useIntl();

  useEffect(() => {
    // first case is for embedded mode, second is for standalone mode
    (document.getElementById('ModuleContainer') || document.getElementById('editor-root'))?.scrollTo({ top: 0 });
  }, []);

  const onClickStartFromScratch = () => {
    // TODO: set default selected profile
    const profile = PROFILE_IDS.MONOGRAPH;
    const savedRecordData = getSavedRecord(profile);
    const typedSavedRecord = savedRecordData ? (savedRecordData.data as RecordEntry) : null;
    const record = typedSavedRecord ? getRecordWithUpdatedID(typedSavedRecord, DEFAULT_RECORD_ID) : null;
    const typedRecord = record as unknown as RecordEntry;

    typedRecord && setRecord(typedRecord);
    getProfiles({ record: typedRecord });
  };

  return selectedProfile ? (
    <div data-testid="edit-page" className="edit-page">
      <Properties />
      <EditSection />
    </div>
  ) : (
    <div>
      <FormattedMessage
        id="marva.select-or-start-from-scratch"
        values={{
          select: <Link to="/load">{formatMessage({ id: 'marva.select-for-editing' })}</Link>,
          startFromScratch: (
            <Link data-testid="start-from-scratch" to="#" onClick={onClickStartFromScratch}>
              {formatMessage({ id: 'marva.start-from-scratch' })}
            </Link>
          ),
        }}
      />
    </div>
  );
};
