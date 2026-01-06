import {
  AuthorityValidationTarget,
  COMPLEX_LOOKUPS_LINKED_FIELDS_MAPPING,
  EMPTY_LINKED_DROPDOWN_OPTION_SUFFIX,
  VALUE_DIVIDER,
} from '@/features/complexLookup/constants/complexLookup.constants';
import { AdvancedFieldType } from '@/common/constants/uiControls.constants';

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
  modalConfig,
  lookupConfig,
}: {
  schema: Map<string, SchemaEntry>;
  linkedField?: SchemaEntry;
  linkedFieldValue?: string;
  modalConfig?: { linkedField?: string };
  lookupConfig?: ComplexLookupsConfigEntry;
}) => {
  // Support both modern (modalConfig) and legacy (lookupConfig) configurations
  const linkedFieldName = modalConfig?.linkedField || lookupConfig?.linkedField;
  const linkedFieldTyped = linkedFieldName as keyof typeof COMPLEX_LOOKUPS_LINKED_FIELDS_MAPPING;
  const linkedFieldValueTyped =
    linkedFieldValue as keyof (typeof COMPLEX_LOOKUPS_LINKED_FIELDS_MAPPING)[typeof linkedFieldTyped];
  const linkedFieldValueUri =
    COMPLEX_LOOKUPS_LINKED_FIELDS_MAPPING?.[linkedFieldTyped]?.[linkedFieldValueTyped]?.uriBFLite;

  let updatedValue: SchemaEntry | undefined;

  linkedField?.children?.forEach(uuid => {
    if (updatedValue) return;

    const childEntry = schema.get(uuid);
    const isDropdownOption = childEntry?.type === AdvancedFieldType.dropdownOption;

    if (isDropdownOption && childEntry.uriBFLite === linkedFieldValueUri) {
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
  selectedEntriesService?: ISelectedEntriesService;
  linkedFieldChildren?: string[];
  newValue?: string;
}) => {
  if (!selectedEntriesService || !linkedFieldChildren || !newValue) return selectedEntries;

  selectedEntriesService.set(selectedEntries);
  selectedEntriesService.removeMultiple(linkedFieldChildren);
  selectedEntriesService.addNew(undefined, newValue);

  return selectedEntriesService.get();
};

export const generateValidationRequestBody = (
  marcData: MarcDTO | null,
  target = AuthorityValidationTarget.CreatorOfWork,
) => {
  if (!marcData) return {};

  const rawMarcEncoded = JSON.stringify(marcData?.parsedRecord?.content, null, 2);
  const escapedString = rawMarcEncoded.replace(/\r/g, '\r').replace(/\n/g, '\n');

  return {
    rawMarc: escapedString,
    target,
  };
};

export const formatComplexLookupDisplayValue = (values?: UserValueContents[]) => {
  if (!values?.length) return '';

  return values
    .filter(({ label }) => label)
    .map(({ label }) => label)
    .join(VALUE_DIVIDER);
};
