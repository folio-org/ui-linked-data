import {
  COMPLEX_LOOKUPS_LINKED_FIELDS_MAPPING,
  EMPTY_LINKED_DROPDOWN_OPTION_SUFFIX,
} from '@common/constants/complexLookup.constants';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';

export const generateEmptyValueUuid = (uuid: string) => `${uuid}_${EMPTY_LINKED_DROPDOWN_OPTION_SUFFIX}`;

export const getLinkedField = ({
  schema,
  linkedEntry,
}: {
  schema: Map<string, SchemaEntry>;
  linkedEntry?: LinkedEntry;
}) => (linkedEntry?.dependent ? schema.get(linkedEntry.dependent) : undefined);

export const updateLinkedFieldValue = ({
  schema,
  linkedField,
  linkedFieldValue,
  lookupConfig,
}: {
  schema: Map<string, SchemaEntry>;
  linkedField?: SchemaEntry;
  linkedFieldValue?: string;
  lookupConfig: ComplexLookupsConfigEntry;
}) => {
  const linkedFieldTyped = lookupConfig.linkedField as keyof typeof COMPLEX_LOOKUPS_LINKED_FIELDS_MAPPING;
  const linkedFieldValueTyped =
    linkedFieldValue as keyof (typeof COMPLEX_LOOKUPS_LINKED_FIELDS_MAPPING)[typeof linkedFieldTyped];
  const linkedFieldValueUri =
    COMPLEX_LOOKUPS_LINKED_FIELDS_MAPPING?.[linkedFieldTyped]?.[linkedFieldValueTyped]?.bf2Uri;

  let updatedValue: SchemaEntry | undefined;

  linkedField?.children?.forEach(uuid => {
    if (updatedValue) return;

    const childEntry = schema.get(uuid);
    const isDropdownOption = childEntry?.type === AdvancedFieldType.dropdownOption;

    if (isDropdownOption && childEntry.uri === linkedFieldValueUri) {
      updatedValue = childEntry;
    }
  });

  return updatedValue;
};

export const getUpdatedSelectedEntries = ({
  selectedEntries,
  selectedEntriesService,
  linkedFieldChildren,
  newValue,
}: {
  selectedEntries: string[];
  selectedEntriesService?: ISelectedEntries;
  linkedFieldChildren?: string[];
  newValue?: string;
}) => {
  if (!selectedEntriesService || !linkedFieldChildren || !newValue) return selectedEntries;

  selectedEntriesService.removeMultiple(linkedFieldChildren);
  selectedEntriesService.addNew(undefined, newValue);

  return selectedEntriesService.get();
};
