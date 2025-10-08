import {
  AuthorityValidationTarget,
  COMPLEX_LOOKUPS_LINKED_FIELDS_MAPPING,
  EMPTY_LINKED_DROPDOWN_OPTION_SUFFIX,
} from '@common/constants/complexLookup.constants';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { AUTHORITY_ASSIGNMENT_CHECK_API_ENDPOINT } from '@common/constants/api.constants';

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

export const validateMarcRecord = (
  marcData: MarcDTO | null,
  lookupConfig: ComplexLookupsConfigEntry,
  authority: string,
  makeRequest: (config: {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: unknown;
  }) => Promise<{ validAssignment: boolean; invalidAssignmentReason?: string }>,
) => {
  const { endpoints, validationTarget } = lookupConfig.api;

  return makeRequest({
    url: endpoints.validation ?? AUTHORITY_ASSIGNMENT_CHECK_API_ENDPOINT,
    method: 'POST' as const,
    body: generateValidationRequestBody(marcData, validationTarget?.[authority]),
  });
};

export const getMarcDataForAssignment = async (
  id: string,
  {
    complexValue,
    marcPreviewMetadata,
    fetchMarcData,
    marcPreviewEndpoint,
  }: {
    complexValue: MarcDTO | null;
    marcPreviewMetadata: MarcPreviewMetadata | null;
    fetchMarcData: (recordId?: string, endpointUrl?: string) => Promise<MarcDTO | undefined>;
    marcPreviewEndpoint?: string;
  },
) => {
  let srsId;
  let marcData = complexValue;

  if (marcPreviewMetadata?.baseId === id) {
    srsId = marcPreviewMetadata.srsId;
  } else {
    const response = await fetchMarcData(id, marcPreviewEndpoint);

    if (response) {
      marcData = response;
      srsId = marcData?.matchedId;
    }
  }

  return { srsId, marcData };
};
