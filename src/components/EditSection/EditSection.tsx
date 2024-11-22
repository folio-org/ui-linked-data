import { useEffect, memo } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import classNames from 'classnames';
import state from '@state';
import { applyUserValues } from '@common/helpers/profile.helper';
import { saveRecordLocally } from '@common/helpers/record.helper';
import { PROFILE_BFIDS } from '@common/constants/bibframe.constants';
import { AUTOSAVE_INTERVAL } from '@common/constants/storage.constants';
import { EDIT_SECTION_CONTAINER_ID } from '@common/constants/uiElements.constants';
import { Fields } from '@components/Fields';
import { Prompt } from '@components/Prompt';
import { useContainerEvents } from '@common/hooks/useContainerEvents';
import { useServicesContext } from '@common/hooks/useServicesContext';
import { renderDrawComponent } from './renderDrawComponent';
import './EditSection.scss';

export const EditSection = memo(() => {
  const { selectedEntriesService } = useServicesContext() as Required<ServicesParams>;
  const resourceTemplates = useRecoilValue(state.config.selectedProfile)?.json.Profile.resourceTemplates;
  const schema = useRecoilValue(state.config.schema);
  const initialSchemaKey = useRecoilValue(state.config.initialSchemaKey);
  const [selectedEntries, setSelectedEntries] = useRecoilState(state.config.selectedEntries);
  const [userValues, setUserValues] = useRecoilState(state.inputs.userValues);
  const [isEdited, setIsEdited] = useRecoilState(state.status.recordIsEdited);
  const record = useRecoilValue(state.inputs.record);
  const selectedRecordBlocks = useRecoilValue(state.inputs.selectedRecordBlocks);
  const [collapsedEntries, setCollapsedEntries] = useRecoilState(state.ui.collapsedEntries);
  const collapsibleEntries = useRecoilValue(state.ui.collapsibleEntries);
  const currentlyEditedEntityBfid = useRecoilValue(state.ui.currentlyEditedEntityBfid);

  useContainerEvents({ watchEditedState: true });

  useEffect(() => {
    if (!isEdited) return;

    const autoSaveRecord = setInterval(() => {
      try {
        const parsed = applyUserValues(schema, initialSchemaKey, { userValues, selectedEntries });

        if (!parsed) return;

        const profile = PROFILE_BFIDS.MONOGRAPH;

        saveRecordLocally({ profile, parsedRecord: parsed, record, selectedRecordBlocks });
      } catch (error) {
        console.error('Unable to automatically save changes:', error);
      }
    }, AUTOSAVE_INTERVAL);

    return () => clearInterval(autoSaveRecord);
  }, [isEdited, userValues]);

  const onChange = (uuid: string, contents: Array<UserValueContents>) => {
    if (!isEdited) setIsEdited(true);

    setUserValues(oldValue => ({
      ...oldValue,
      [uuid]: {
        uuid,
        contents,
      },
    }));
  };

  const handleGroupsCollapseExpand = () =>
    setCollapsedEntries(collapsedEntries.size ? new Set([]) : collapsibleEntries);

  // Uncomment if it is needed to render certain groups of fields disabled, then use it as a prop in Fields component
  // const disabledFields = useMemo(() => getAllDisabledFields(schema), [schema]);

  const drawComponent = renderDrawComponent({
    selectedEntriesService,
    selectedEntries,
    setSelectedEntries,
    userValues,
    collapsedEntries,
    collapsibleEntries,
    onChange,
    handleGroupsCollapseExpand,
  });

  return resourceTemplates ? (
    <div
      id={EDIT_SECTION_CONTAINER_ID}
      className={classNames('edit-section', {
        'edit-section-passive': currentlyEditedEntityBfid.has(PROFILE_BFIDS.WORK),
      })}
    >
      <Prompt when={isEdited} />
      <Fields
        drawComponent={drawComponent}
        uuid={initialSchemaKey}
        groupClassName="edit-section-group"
        scrollToEnabled={true}
      />
    </div>
  ) : null;
});
