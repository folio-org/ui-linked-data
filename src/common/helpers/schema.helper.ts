import { v4 as uuidv4 } from 'uuid';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import {
  BFLITE_LABELS_MAP,
  BFLITE_URIS,
  ADVANCED_FIELDS,
  TEMP_BF2_TO_BFLITE_MAP,
  NOTE_TYPE_MAP,
  NON_BF_GROUP_TYPE,
} from '@common/constants/bibframeMapping.constants';
import {
  IGNORE_HIDDEN_PARENT_OR_RECORD_SELECTION,
  TEMPORARY_URIS_WITHOUT_MAPPING,
  TYPE_URIS,
} from '@common/constants/bibframe.constants';
import { checkIdentifierAsValue } from '@common/helpers/record.helper';
import { getUris } from './bibframe.helper';

export const getLookupLabelKey = (uriBFLite?: string) => {
  const typedUriBFLite = uriBFLite as keyof typeof BFLITE_LABELS_MAP;

  return uriBFLite ? BFLITE_LABELS_MAP[typedUriBFLite] || BFLITE_URIS.LABEL : BFLITE_URIS.TERM;
};

export const getAdvancedValuesField = (uriBFLite?: string) => {
  const typedUriBFLite = uriBFLite as keyof typeof ADVANCED_FIELDS;

  return uriBFLite ? ADVANCED_FIELDS[typedUriBFLite]?.valueUri : undefined;
};

export const generateAdvancedFieldObject = ({
  advancedValueField,
  label,
}: {
  advancedValueField?: string;
  label?: string;
}) => (advancedValueField && label ? { [advancedValueField]: [label] } : undefined);

export const generateUserValueObject = ({
  entry,
  type,
  uriBFLite,
  propertyURI,
  lookupData,
  nonBFMappedGroup,
}: {
  entry: any;
  type: AdvancedFieldType;
  uriBFLite?: string;
  propertyURI?: string;
  lookupData?: MultiselectOption[] | null;
  nonBFMappedGroup?: NonBFMappedGroup;
}) => {
  const keyName = getLookupLabelKey(uriBFLite);
  const advancedValueField = getAdvancedValuesField(uriBFLite);
  let labelKeyName = advancedValueField || keyName;
  let uri = BFLITE_URIS.LINK;
  let label;

  if (type === AdvancedFieldType.simple && lookupData) {
    const isNonBFTypeKey = nonBFMappedGroup && propertyURI ? nonBFMappedGroup.data[propertyURI]?.key : '';
    let link = nonBFMappedGroup ? entry : entry[uri]?.[0];
    uri = link;

    // This is used for the simple lookups which have a speciall data structure in the record,
    // e.g. "Notes about the Instance", "Notes about the Work"
    if (nonBFMappedGroup) {
      labelKeyName = isNonBFTypeKey;
      link = NOTE_TYPE_MAP[entry as keyof typeof NOTE_TYPE_MAP] || entry;
    }

    const lookupDataElement = lookupData.find(({ value }) => value.uri === link);

    if (lookupDataElement) {
      label = lookupDataElement.label;
    } else if (nonBFMappedGroup) {
      label = entry;
    } else {
      label = entry?.[labelKeyName];
    }
  } else {
    label = Array.isArray(entry[labelKeyName]) ? entry[labelKeyName][0] : entry[labelKeyName];
  }

  return {
    label,
    meta: {
      parentURI: uri,
      uri,
      type,
    },
  };
};

export const getSelectedRecord = (uriWithSelector: string, record?: Record<string, any> | Array<any>) =>
  Array.isArray(record)
    ? record?.find(entry => Object.keys(entry).includes(uriWithSelector))?.[uriWithSelector]
    : record?.[uriWithSelector];

export const generateRecordForDropdown = ({
  record,
  uriWithSelector,
  hasRootWrapper,
}: {
  record?: Record<string, any> | Array<any>;
  uriWithSelector: string;
  hasRootWrapper: boolean;
}) => {
  let recordWithSelector = record;
  const identifierAsValueSelection =
    record && checkIdentifierAsValue(record as Record<string, string[]>, uriWithSelector);

  if (identifierAsValueSelection) return identifierAsValueSelection;

  // return the record as is if uriWithSelector is not present in the bflite (intermediate)
  if (IGNORE_HIDDEN_PARENT_OR_RECORD_SELECTION.includes(uriWithSelector)) {
    return recordWithSelector;
  }

  if (hasRootWrapper) {
    // in bflite, the work component resides within the instance component
    if (uriWithSelector === BFLITE_URIS.INSTANTIATES) {
      recordWithSelector = getSelectedRecord(TYPE_URIS.INSTANCE, record);
    }

    return getSelectedRecord(uriWithSelector, recordWithSelector);
  }

  return record;
};

export const generateUserValueContent = ({
  entry,
  type,
  uriBFLite,
  propertyURI,
  lookupData,
  nonBFMappedGroup,
}: {
  entry: string | Record<string, unknown> | Array<Record<string, unknown>>;
  type: AdvancedFieldType;
  uriBFLite?: string;
  propertyURI?: string;
  lookupData?: MultiselectOption[] | null;
  nonBFMappedGroup?: NonBFMappedGroup;
}) =>
  typeof entry === 'string' && type !== AdvancedFieldType.simple
    ? {
        label: entry,
      }
    : generateUserValueObject({ entry, type, uriBFLite, propertyURI, lookupData, nonBFMappedGroup });

export const getFilteredRecordData = ({
  valueTemplateRefs,
  templates,
  base,
  path,
  selectedRecord,
}: {
  valueTemplateRefs: string[];
  templates: ResourceTemplates;
  base: Map<string, SchemaEntry>;
  path: string[];
  selectedRecord: Record<string, any>;
}) =>
  valueTemplateRefs.filter(templateRef => {
    const entryData = templates[templateRef];
    const { uriBFLite } = getUris({ uri: entryData?.resourceURI, schema: base, path });

    if (!uriBFLite) return;

    return selectedRecord?.[uriBFLite];
  });

export const generateCopiedGroupUuids = ({
  valueTemplateRefs,
  templates,
  base,
  path,
  selectedRecord,
}: {
  valueTemplateRefs: string[];
  templates: ResourceTemplates;
  base: Map<string, SchemaEntry>;
  path: string[];
  selectedRecord: Record<string, any>;
}) => {
  const copiedGroupUuids: Array<Array<string>> = [];

  valueTemplateRefs.forEach(item => {
    const entryData = templates[item];
    const { uriBFLite } = getUris({ uri: entryData.resourceURI, schema: base, path });

    if (!uriBFLite) return;

    // TODO: remove or refactor it when the API contract for Extent and similar fields is updated
    const isTempUri = TEMPORARY_URIS_WITHOUT_MAPPING.includes(uriBFLite);
    const recordData = isTempUri ? selectedRecord?.[TEMP_BF2_TO_BFLITE_MAP[uriBFLite]] : selectedRecord?.[uriBFLite];

    if (!recordData?.length && !isTempUri) {
      copiedGroupUuids.push([]);

      return;
    }

    const uuidList = recordData?.map(() => uuidv4()) || [];
    copiedGroupUuids.push(uuidList);
  });

  return copiedGroupUuids;
};

export const hasChildEntry = (schema: Map<string, SchemaEntry>, children?: string[]) => {
  if (!children) return false;

  return children.reduce((accum, current) => {
    if (accum) return accum;

    accum = !!schema.get(current);

    return accum;
  }, false);
};

export const getMappedNonBFGroupType = (propertyURI: string) => NON_BF_GROUP_TYPE[propertyURI];

export const checkGroupIsNonBFMapped = ({
  propertyURI,
  parentEntryType,
  type,
}: {
  propertyURI?: string;
  parentEntryType?: AdvancedFieldType;
  type: AdvancedFieldType;
}) => {
  const { block, groupComplex } = AdvancedFieldType;
  const mappedGroup = !!propertyURI && getMappedNonBFGroupType(propertyURI);

  return mappedGroup && parentEntryType === block && type === groupComplex;
};

export const selectNonBFMappedGroupData = ({
  propertyURI,
  type,
  parentEntryType,
  selectedRecord,
}: {
  propertyURI: string;
  type: AdvancedFieldType;
  parentEntryType?: AdvancedFieldType;
  selectedRecord?: Record<string, Record<string, string[]>[]>;
}) => {
  const mappedGroup = getMappedNonBFGroupType(propertyURI);
  const isNonBFMappedGroup = checkGroupIsNonBFMapped({ propertyURI, parentEntryType, type });
  const selectedNonBFRecord = isNonBFMappedGroup ? selectedRecord?.[mappedGroup?.container.key] : undefined;
  const nonBFMappedGroup = isNonBFMappedGroup
    ? {
        uri: propertyURI,
        data: mappedGroup,
      }
    : undefined;

  return { selectedNonBFRecord, nonBFMappedGroup };
};
