import { v4 as uuidv4 } from 'uuid';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { BFLITE_LABELS_MAP, BFLITE_URIS, ADVANCED_FIELDS } from '@common/constants/bibframeMapping.constants';
import { getUris } from './bibframe.helper';
import { IGNORE_HIDDEN_PARENT_OR_RECORD_SELECTION, TYPE_URIS } from '@common/constants/bibframe.constants';
import { checkIdentifierAsValue } from '@common/helpers/record.helper';

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

export const generateUserValueObject = (entry: any, type: AdvancedFieldType, uriBFLite?: string) => {
  const keyName = getLookupLabelKey(uriBFLite);
  const advancedValueField = getAdvancedValuesField(uriBFLite);
  const labelKeyName = advancedValueField || keyName;
  const uri = BFLITE_URIS.LINK;
  const label = Array.isArray(entry[labelKeyName]) ? entry[labelKeyName][0] : entry[labelKeyName];

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

export const generateUserValueContent = (
  entry: string | Record<string, any> | Array<Record<string, any>>,
  type: AdvancedFieldType,
  uriBFLite?: string,
) =>
  typeof entry === 'string'
    ? {
        label: entry,
      }
    : generateUserValueObject(entry, type, uriBFLite);

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

    const recordData = selectedRecord?.[uriBFLite];

    if (!recordData?.length) {
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
