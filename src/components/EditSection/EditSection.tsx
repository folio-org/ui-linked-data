import { memo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debounce } from 'lodash';
import classNames from 'classnames';
import { EDIT_SECTION_CONTAINER_ID } from '@/common/constants/uiElements.constants';
import { QueryParams } from '@/common/constants/routes.constants';
import { Fields } from '@/components/Fields';
import { Prompt } from '@/components/Prompt';
import { useContainerEvents } from '@/common/hooks/useContainerEvents';
import { useServicesContext } from '@/common/hooks/useServicesContext';
import { useInputsState, useProfileState, useStatusState, useUIState } from '@/store';
import { getEditSectionPassiveClass, hasReference, resolveResourceType } from '@/configs/resourceTypes';
import { renderDrawComponent } from './renderDrawComponent';
import './EditSection.scss';

const USER_INPUT_DELAY = 100;

export const EditSection = memo(() => {
  const { selectedEntriesService } = useServicesContext() as Required<ServicesParams>;
  const { initialSchemaKey } = useProfileState(['initialSchemaKey']);
  const { userValues, addUserValuesItem, selectedEntries, setSelectedEntries } = useInputsState([
    'userValues',
    'addUserValuesItem',
    'selectedEntries',
    'setSelectedEntries',
  ]);
  const { isRecordEdited: isEdited, setIsRecordEdited: setIsEdited } = useStatusState([
    'isRecordEdited',
    'setIsRecordEdited',
  ]);
  const { collapsedEntries, setCollapsedEntries, collapsibleEntries } = useUIState([
    'collapsedEntries',
    'setCollapsedEntries',
    'collapsibleEntries',
  ]);
  const { selectedRecordBlocks } = useInputsState(['selectedRecordBlocks']);

  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get(QueryParams.Type);

  // Resolve resource type: from loaded record (Edit) or URL param (Create)
  const blockUri = selectedRecordBlocks?.block;
  const resourceType = resolveResourceType(blockUri, typeParam);

  // Get the passive class from registry - only apply if this type has a reference (dual-panel layout)
  const passiveClass = hasReference(resourceType) ? getEditSectionPassiveClass(resourceType) : undefined;

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

  return (
    <div id={EDIT_SECTION_CONTAINER_ID} className={classNames('edit-section', passiveClass)}>
      <Prompt when={isEdited} />
      <Fields
        drawComponent={drawComponent}
        uuid={initialSchemaKey}
        groupClassName="edit-section-group"
        scrollToEnabled={true}
      />
    </div>
  );
});
