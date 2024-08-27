import { useEffect, memo, useCallback, useContext } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import state from '@state';
import { applyUserValues } from '@common/helpers/profile.helper';
import { saveRecordLocally } from '@common/helpers/record.helper';
import { GROUP_COMPLEX_CUTOFF_LEVEL, PROFILE_BFIDS } from '@common/constants/bibframe.constants';
import { AUTOSAVE_INTERVAL } from '@common/constants/storage.constants';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { EDIT_ALT_DISPLAY_LABELS, EDIT_SECTION_CONTAINER_ID } from '@common/constants/uiElements.constants';
import { Fields } from '@components/Fields';
import { LiteralField } from '@components/LiteralField';
import { DropdownField } from '@components/DropdownField';
import { SimpleLookupField } from '@components/SimpleLookupField';
import { ComplexLookupField } from '@components/ComplexLookupField';
import { Prompt } from '@components/Prompt';
import { IS_EMBEDDED_MODE } from '@common/constants/build.constants';
import { getWrapperAsWebComponent } from '@common/helpers/dom.helper';
import { findParentEntryByProperty } from '@common/helpers/schema.helper';
import { FieldWithMetadataAndControls } from '@components/FieldWithMetadataAndControls';
import { Button, ButtonType } from '@components/Button';
import { ServicesContext } from '@src/contexts';
import './EditSection.scss';

export type IDrawComponent = {
  schema: Map<string, SchemaEntry>;
  entry: SchemaEntry;
  disabledFields?: Schema;
  level?: number;
  isCompact?: boolean;
};

export const EditSection = memo(() => {
  const { selectedEntriesService: baseSelectedEntriesService } = useContext(ServicesContext);
  const selectedEntriesService = baseSelectedEntriesService as ISelectedEntries;
  const resourceTemplates = useRecoilValue(state.config.selectedProfile)?.json.Profile.resourceTemplates;
  const schema = useRecoilValue(state.config.schema);
  const initialSchemaKey = useRecoilValue(state.config.initialSchemaKey);
  const [selectedEntries, setSelectedEntries] = useRecoilState(state.config.selectedEntries);
  const [userValues, setUserValues] = useRecoilState(state.inputs.userValues);
  const [isEdited, setIsEdited] = useRecoilState(state.status.recordIsEdited);
  const record = useRecoilValue(state.inputs.record);
  const selectedRecordBlocks = useRecoilValue(state.inputs.selectedRecordBlocks);
  const customEvents = useRecoilValue(state.config.customEvents);
  const [collapsedGroups, setCollapsedGroups] = useRecoilState(state.ui.collapsedGroups);
  const clonePrototypes = useRecoilValue(state.config.clonePrototypes);
  const currentlyEditedEntityBfid = useRecoilValue(state.ui.currentlyEditedEntityBfid);

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
    if (!isEdited) {
      setIsEdited(true);

      IS_EMBEDDED_MODE &&
        customEvents?.BLOCK_NAVIGATION &&
        getWrapperAsWebComponent()?.dispatchEvent(new CustomEvent(customEvents.BLOCK_NAVIGATION));
    }

    setUserValues(oldValue => ({
      ...oldValue,
      [uuid]: {
        uuid,
        contents,
      },
    }));
  };

  const handleGroupsCollapseExpand = () => setCollapsedGroups(collapsedGroups.length ? [] : clonePrototypes);

  const drawComponent = useCallback(
    ({ schema, entry, disabledFields, level = 0, isCompact = false }: IDrawComponent) => {
      const { uuid, displayName = '', type, children, constraints } = entry;
      const isDisabled = !!disabledFields?.get(uuid);
      const displayNameWithAltValue = EDIT_ALT_DISPLAY_LABELS[displayName] || displayName;
      const selectedUserValue = userValues[uuid];

      if (type === AdvancedFieldType.block) {
        return (
          <FieldWithMetadataAndControls
            entry={entry}
            level={level}
            isCompact={isCompact}
            showLabel={false}
            className="entity-heading"
          >
            <strong className="heading">{displayNameWithAltValue}</strong>
            {!!clonePrototypes.length && (
              <Button className="toggle-expansion-button" type={ButtonType.Link} onClick={handleGroupsCollapseExpand}>
                <FormattedMessage id={collapsedGroups.length ? 'marva.expandAll' : 'marva.collapseAll'} />
              </Button>
            )}
          </FieldWithMetadataAndControls>
        );
      }

      if (
        (type === AdvancedFieldType.group || type === AdvancedFieldType.groupComplex) &&
        level < GROUP_COMPLEX_CUTOFF_LEVEL
      ) {
        const isComplexGroup = type === AdvancedFieldType.groupComplex;

        return (
          <FieldWithMetadataAndControls entry={entry} level={level} isCompact={isCompact} showLabel={isComplexGroup}>
            {!isComplexGroup && <span className="group-label">{displayNameWithAltValue}</span>}
          </FieldWithMetadataAndControls>
        );
      }

      if (type === AdvancedFieldType.literal) {
        return (
          <FieldWithMetadataAndControls entry={entry} level={level} isCompact={isCompact}>
            <LiteralField
              uuid={uuid}
              value={selectedUserValue?.contents[0].label}
              onChange={onChange}
              isDisabled={isDisabled}
            />
          </FieldWithMetadataAndControls>
        );
      }

      if (type === AdvancedFieldType.dropdown && children) {
        const options = children
          .map(id => schema.get(id))
          .map(entry => ({
            label: entry?.displayName ?? '',
            value: entry?.uri ?? '', // TBD
            uri: entry?.uri ?? '',
            id: entry?.uuid,
          }));

        const selectedOption = options?.find(({ id }) => id && selectedEntries.includes(id));

        const handleChange = (option: any) => {
          selectedEntriesService.addNew(selectedOption?.id, option.id);

          setSelectedEntries(selectedEntriesService.get());
        };

        return (
          <FieldWithMetadataAndControls entry={entry} level={level} isCompact={isCompact}>
            <DropdownField
              options={options}
              uuid={uuid}
              onChange={handleChange}
              value={selectedOption}
              isDisabled={isDisabled || entry?.layout?.readOnly}
            />
          </FieldWithMetadataAndControls>
        );
      }

      if (type === AdvancedFieldType.simple) {
        const blockEntry = findParentEntryByProperty({
          schema,
          path: entry.path,
          key: 'type',
          value: AdvancedFieldType.block,
        });

        return (
          <FieldWithMetadataAndControls entry={entry} level={level} isCompact={isCompact}>
            <SimpleLookupField
              uri={constraints?.useValuesFrom[0] || ''}
              uuid={uuid}
              onChange={onChange}
              parentUri={constraints?.valueDataType?.dataTypeURI}
              value={selectedUserValue?.contents}
              isDisabled={isDisabled}
              propertyUri={entry.uri}
              parentBlockUri={blockEntry?.uriBFLite}
            />
          </FieldWithMetadataAndControls>
        );
      }

      if (type === AdvancedFieldType.complex) {
        return (
          <FieldWithMetadataAndControls entry={entry} level={level} isCompact={isCompact}>
            <ComplexLookupField entry={entry} onChange={onChange} value={selectedUserValue?.contents} />
          </FieldWithMetadataAndControls>
        );
      }

      return null;
    },
    [selectedEntries, collapsedGroups],
  );

  // TODO: uncomment if it is needed to render certain groups of fields disabled, then use it as a prop in Fields component
  // const disabledFields = useMemo(() => getAllDisabledFields(schema), [schema]);

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
