import { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import { GROUP_COMPLEX_CUTOFF_LEVEL } from '@common/constants/bibframe.constants';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { EDIT_ALT_DISPLAY_LABELS } from '@common/constants/uiElements.constants';
import { findParentEntryByProperty } from '@common/helpers/schema.helper';
import { Button, ButtonType } from '@components/Button';
import { ComplexLookupField } from '@components/ComplexLookupField';
import { DropdownField } from '@components/DropdownField';
import { FieldWithMetadataAndControls } from '@components/FieldWithMetadataAndControls';
import { LiteralField } from '@components/LiteralField';
import { SimpleLookupField } from '@components/SimpleLookupField';
import { EditSectionDataProps } from './renderDrawComponent';
import { CUSTOM_PROFILE_ENABLED } from '@common/constants/feature.constants';

export type IDrawComponent = {
  schema: Map<string, SchemaEntry>;
  entry: SchemaEntry;
  disabledFields?: Schema;
  level?: number;
  isCompact?: boolean;
};

export const DrawComponent: FC<IDrawComponent & EditSectionDataProps> = ({
  schema,
  entry,
  disabledFields,
  level = 0,
  isCompact = false,
  selectedEntriesService,
  selectedEntries,
  setSelectedEntries,
  userValues,
  collapsedEntries,
  collapsibleEntries,
  onChange,
  handleGroupsCollapseExpand,
}) => {
  const { uuid, displayName = '', type, children, constraints, htmlId } = entry;
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
        {!!collapsibleEntries.size && (
          <Button className="toggle-expansion-button" type={ButtonType.Link} onClick={handleGroupsCollapseExpand}>
            <FormattedMessage id={collapsedEntries.size ? 'ld.expandAll' : 'ld.collapseAll'} />
          </Button>
        )}
      </FieldWithMetadataAndControls>
    );
  }

  if (
    (type === AdvancedFieldType.group || type === AdvancedFieldType.groupComplex) &&
    level < GROUP_COMPLEX_CUTOFF_LEVEL
  ) {
    const isComplexGroup = CUSTOM_PROFILE_ENABLED ? true : type === AdvancedFieldType.groupComplex;

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
          htmlId={htmlId}
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
          htmlId={htmlId}
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
          uri={constraints?.useValuesFrom[0] ?? ''}
          uuid={uuid}
          htmlId={htmlId}
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
};
