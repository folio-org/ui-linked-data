import { memo, useRef } from 'react';
import { debounce } from 'lodash';
import classNames from 'classnames';
import { PROFILE_BFIDS } from '@common/constants/bibframe.constants';
import { EDIT_SECTION_CONTAINER_ID } from '@common/constants/uiElements.constants';
import { Fields } from '@components/Fields';
import { Prompt } from '@components/Prompt';
import { useContainerEvents } from '@common/hooks/useContainerEvents';
import { useServicesContext } from '@common/hooks/useServicesContext';
import { useInputsState, useProfileState, useStatusState, useUIState } from '@src/store';
import { renderDrawComponent } from './renderDrawComponent';
import './EditSection.scss';

const USER_INPUT_DELAY = 100;

export const EditSection = memo(() => {
  const { selectedEntriesService } = useServicesContext() as Required<ServicesParams>;
  const { selectedProfile, initialSchemaKey } = useProfileState();
  const resourceTemplates = selectedProfile?.json.Profile.resourceTemplates;
  const { userValues, addUserValuesItem, selectedEntries, setSelectedEntries } = useInputsState();
  const { isRecordEdited: isEdited, setIsRecordEdited: setIsEdited } = useStatusState();
  const { collapsedEntries, setCollapsedEntries, collapsibleEntries, currentlyEditedEntityBfid } = useUIState();

  useContainerEvents({ watchEditedState: true });

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
