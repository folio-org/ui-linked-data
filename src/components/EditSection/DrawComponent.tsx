import { FC } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { GROUP_COMPLEX_CUTOFF_LEVEL } from '@/common/constants/bibframe.constants';
import { AdvancedFieldType } from '@/common/constants/uiControls.constants';
import { EDIT_ALT_DISPLAY_LABELS } from '@/common/constants/uiElements.constants';
import { findParentEntryByProperty } from '@/common/helpers/schema.helper';
import { getIsCreatePage } from '@/common/helpers/navigation.helper';
import { Button, ButtonType } from '@/components/Button';
import { ComplexLookupField } from '@/features/complexLookup/components/ComplexLookupField';
import { DropdownField } from '@/components/DropdownField';
import { FieldWithMetadataAndControls } from '@/components/FieldWithMetadataAndControls';
import { LiteralField } from '@/components/LiteralField';
import { SimpleLookupField } from '@/components/SimpleLookupField';
import { EditSectionDataProps } from './renderDrawComponent';
import { getPlaceholderForProperty } from '@/features/search/core';

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
  const isEditable = !!entry.constraints?.editable || typeof entry.constraints === 'undefined';
  const isDisabled = !!disabledFields?.get(uuid) || !isEditable;
  const displayNameWithAltValue = EDIT_ALT_DISPLAY_LABELS[displayName] || displayName;
  const selectedUserValue = userValues[uuid];
  const { formatMessage } = useIntl();
  const isCreating = getIsCreatePage();
  const placeholderId = !isCreating ? getPlaceholderForProperty(entry.uriBFLite) : undefined;
  const placeholder = placeholderId ? formatMessage({ id: placeholderId }) : undefined;

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
    return <FieldWithMetadataAndControls entry={entry} level={level} isCompact={isCompact} showLabel />;
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
          placeholder={placeholder}
        />
      </FieldWithMetadataAndControls>
    );
  }

  if ((type === AdvancedFieldType.dropdown || type === AdvancedFieldType.enumerated) && children) {
    const options = children
      .map(id => schema.get(id))
      .map(entry => ({
        label: entry?.displayName ?? '',
        value: entry?.uriBFLite ?? '', // TBD
        uri: entry?.uriBFLite ?? '',
        id: entry?.uuid,
      }));

    const selectedOption = options?.find(({ id }) => id && selectedEntries.includes(id));
    const marcMapping = selectedOption?.id ? schema.get(selectedOption?.id)?.marcMapping : undefined;

    const handleChange = (option: any) => {
      selectedEntriesService.addNew(selectedOption?.id, option.id);

      setSelectedEntries(selectedEntriesService.get());

      if (type === AdvancedFieldType.enumerated) {
        onChange(uuid, [
          {
            id: option.id,
            label: option.label,
            meta: {
              uri: option.value,
              basicLabel: option.label,
            },
          },
        ]);
      }
    };

    return (
      <FieldWithMetadataAndControls entry={entry} level={level} isCompact={isCompact} marcMapping={marcMapping}>
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

    const groupEntry = findParentEntryByProperty({
      schema,
      path: entry.path,
      key: 'type',
      value: AdvancedFieldType.group,
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
          isMulti={constraints?.repeatable}
          propertyUri={entry.uriBFLite}
          parentBlockUri={blockEntry?.uriBFLite}
          parentGroupUri={groupEntry?.uriBFLite}
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
