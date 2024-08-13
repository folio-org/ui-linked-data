import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import {
  BFLITE_LABELS_MAP,
  BFLITE_URIS,
  ADVANCED_FIELDS,
  NON_BF_GROUP_TYPE,
} from '@common/constants/bibframeMapping.constants';

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

export const hasChildEntry = (schema: Map<string, SchemaEntry>, children?: string[]) => {
  if (!children) return false;

  return children.reduce((accum, current) => {
    if (accum) return accum;

    accum = !!schema.get(current);

    return accum;
  }, false);
};

export const getMappedNonBFGroupType = (propertyURI?: string) => {
  if (!propertyURI || !NON_BF_GROUP_TYPE[propertyURI]) return undefined;

  return NON_BF_GROUP_TYPE[propertyURI] as unknown as NonBFMappedGroupData;
};

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
  const mappedGroup = getMappedNonBFGroupType(propertyURI);

  return !!mappedGroup && parentEntryType === block && type === groupComplex;
};

export const getRecordEntry = (recordEntry?: Record<string, Record<string, string[]>[]>) =>
  Array.isArray(recordEntry) ? recordEntry[0] : recordEntry;

export const selectNonBFMappedGroupData = ({
  propertyURI,
  type,
  parentEntryType,
  selectedRecord,
}: {
  propertyURI: string;
  type: AdvancedFieldType;
  parentEntryType?: AdvancedFieldType;
  selectedRecord?: Record<string, Record<string, string[]>[]> | Record<string, Record<string, string[]>[]>;
}) => {
  const mappedGroup = getMappedNonBFGroupType(propertyURI);
  const isNonBFMappedGroup = checkGroupIsNonBFMapped({ propertyURI, parentEntryType, type });
  const recordEntry = getRecordEntry(selectedRecord);
  const selectedNonBFRecord =
    isNonBFMappedGroup && mappedGroup && mappedGroup?.container?.key
      ? recordEntry?.[mappedGroup.container.key]
      : undefined;
  const nonBFMappedGroup = isNonBFMappedGroup
    ? {
        uri: propertyURI,
        data: mappedGroup,
      }
    : undefined;

  return { selectedNonBFRecord, nonBFMappedGroup };
};

export const findParentEntryByProperty = <T>({
  schema,
  path,
  key,
  value,
}: {
  schema: Schema;
  path: string[];
  key: keyof SchemaEntry;
  value: T;
}) =>
  path.reduce(
    (accum, pathItem) => {
      const schemaElem = schema.get(pathItem);
      const hasCorrectValue = schemaElem?.[key] === value;

      if (hasCorrectValue) {
        accum = schemaElem;
      }

      return accum;
    },
    null as SchemaEntry | null,
  );

export const normalizeLayoutProperty = (layout?: PropertyLayout<string>) => {
  if (!layout) return;

  const normalizedLayout = { ...layout } as unknown as PropertyLayout<boolean>;

  if (layout?.readOnly) {
    normalizedLayout.readOnly = Boolean(layout?.readOnly);
  }

  if (layout?.isNew) {
    normalizedLayout.isNew = Boolean(layout.isNew);
  }

  return normalizedLayout;
};

export const getParentEntryUuid = (path: string[]) => {
  const index = path.length - 2;
  const parentEntryIndex = index >= 0 ? index : 0;

  return path[parentEntryIndex];
};
