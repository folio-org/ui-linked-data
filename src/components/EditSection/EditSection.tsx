import { useEffect, memo, useRef } from 'react';
import { debounce } from 'lodash';
import classNames from 'classnames';
import { saveRecordLocally } from '@common/helpers/record.helper';
import { PROFILE_BFIDS } from '@common/constants/bibframe.constants';
import { AUTOSAVE_INTERVAL } from '@common/constants/storage.constants';
import { EDIT_SECTION_CONTAINER_ID } from '@common/constants/uiElements.constants';
import { Fields } from '@components/Fields';
import { Prompt } from '@components/Prompt';
import { useContainerEvents } from '@common/hooks/useContainerEvents';
import { useServicesContext } from '@common/hooks/useServicesContext';
import { useRecordGeneration } from '@common/hooks/useRecordGeneration';
import { useInputsState, useProfileState, useStatusState, useUIState } from '@src/store';
import { renderDrawComponent } from './renderDrawComponent';
import './EditSection.scss';

const USER_INPUT_DELAY = 750;

export const EditSection = memo(() => {
  const { selectedEntriesService } = useServicesContext() as Required<ServicesParams>;
  const { selectedProfile, initialSchemaKey } = useProfileState();
  const resourceTemplates = selectedProfile?.json.Profile.resourceTemplates;
  const { userValues, addUserValuesItem, selectedRecordBlocks, record, selectedEntries, setSelectedEntries } =
    useInputsState();
  const { isEditedRecord: isEdited, setIsEditedRecord: setIsEdited } = useStatusState();
  const { collapsedEntries, setCollapsedEntries, collapsibleEntries, currentlyEditedEntityBfid } = useUIState();
  const { generateRecord } = useRecordGeneration();

  useContainerEvents({ watchEditedState: true });

  useEffect(() => {
    if (!isEdited) return;

    const autoSaveRecord = setInterval(() => {
      try {
        const parsed = generateRecord();

        if (!parsed) return;

        const profile = PROFILE_BFIDS.MONOGRAPH;

        saveRecordLocally({ profile, parsedRecord: parsed, record, selectedRecordBlocks });
      } catch (error) {
        console.error('Unable to automatically save changes:', error);
      }
    }, AUTOSAVE_INTERVAL);

    return () => clearInterval(autoSaveRecord);
  }, [isEdited, userValues]);

  const debouncedAddUserValues = useRef(
    debounce((value: UserValues) => {
      addUserValuesItem?.(value);
    }, USER_INPUT_DELAY),
  ).current;

  const onChange = (uuid: string, contents: Array<UserValueContents>) => {
    if (!isEdited) setIsEdited(true);

    debouncedAddUserValues({
      [uuid]: {
        uuid,
        contents,
      },
    });
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
