import {
  BFID_DELIMITER,
  BF_URI_DELIMITER,
  ENTRY_CONTROL_DELIMITER,
  ENTRY_COUNT_DELIMITER,
  ENTRY_DELIMITER,
  EXTRA_BFID_DELIMITER,
  PREV_ENTRY_PATH_INDEX,
  TWIN_CHILDREN_KEY_DELIMITER,
} from '@/common/constants/bibframe.constants';
import { BFLITE_LABELS_MAP, BFLITE_URIS } from '@/common/constants/bibframeMapping.constants';
import { AdvancedFieldType, SchemaControlType, UI_CONTROLS_LIST } from '@/common/constants/uiControls.constants';

export const getLookupLabelKey = (uriBFLite?: string) => {
  const typedUriBFLite = uriBFLite as keyof typeof BFLITE_LABELS_MAP;

  return uriBFLite ? BFLITE_LABELS_MAP[typedUriBFLite] || BFLITE_URIS.LABEL : BFLITE_URIS.TERM;
};

export const hasChildEntry = (schema: Map<string, SchemaEntry>, children?: string[]) => {
  if (!children) return false;

  return children.reduce((accum, current) => {
    if (accum) return accum;

    accum = !!schema.get(current);

    return accum;
  }, false);
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

export const getParentEntryUuid = (path: string[]) => {
  const index = path.length - PREV_ENTRY_PATH_INDEX;
  const parentEntryIndex = index >= 0 ? index : 0;

  return path[parentEntryIndex];
};

export const getAssociatedControlledByEntry = (
  schema: Schema,
  parentEntryChildren?: string[],
  dependsOnId?: string,
) => {
  let controlledByEntry: SchemaEntry | undefined;

  parentEntryChildren?.forEach(entry => {
    if (controlledByEntry) return;

    const childEntry = schema.get(entry);

    if (childEntry?.bfid === dependsOnId) {
      controlledByEntry = childEntry;
    }
  });

  return controlledByEntry;
};

export const getUdpatedAssociatedEntries = ({
  schema,
  dependentEntry,
  parentEntryChildren,
  dependsOnId,
}: {
  schema: Schema;
  dependentEntry: SchemaEntry;
  parentEntryChildren?: string[];
  dependsOnId?: string;
}) => {
  const constolledByEntry = getAssociatedControlledByEntry(schema, parentEntryChildren, dependsOnId);
  const updatedConstolledByEntry = { ...constolledByEntry };
  const updatedDependentEntry = { ...dependentEntry };

  if (constolledByEntry) {
    updatedConstolledByEntry.linkedEntry = { dependent: updatedDependentEntry.uuid };
    updatedDependentEntry.linkedEntry = { controlledBy: updatedConstolledByEntry.uuid };
  }

  return { controlledByEntry: updatedConstolledByEntry, dependentEntry: updatedDependentEntry };
};

export const getHtmlIdForEntry = ({ path = [] }: Partial<SchemaEntry>, schema: Schema) => {
  return path
    .reduce((acc, uuid) => {
      const pathEntry = schema.get(uuid);

      if (!pathEntry) return acc;

      const { uriBFLite, uri, bfid, cloneIndex } = pathEntry;
      const uriSelector = uriBFLite ?? uri;
      const formattedBFId = bfid?.split(BFID_DELIMITER).at(-1);
      let id = uriSelector ? uriSelector.split(BF_URI_DELIMITER).at(-1) : formattedBFId;

      if (formattedBFId && formattedBFId !== id) {
        id += `${EXTRA_BFID_DELIMITER}${formattedBFId}`;
      }

      return [...acc, `${id}${ENTRY_COUNT_DELIMITER}${cloneIndex ?? 0}`];
    }, [] as string[])
    .join(ENTRY_DELIMITER);
};

export const getHtmlIdForSchemaControl = (controlType: SchemaControlType, htmlId = '') =>
  `${htmlId}${ENTRY_CONTROL_DELIMITER}${controlType}`;

export const generateTwinChildrenKey = (entry: SchemaEntry) => {
  const { uriBFLite, constraints } = entry;
  const { valueDataType } = constraints ?? {};
  const suffix = valueDataType?.dataTypeURI ? `${TWIN_CHILDREN_KEY_DELIMITER}${valueDataType?.dataTypeURI}` : '';

  return `${uriBFLite}${suffix}`;
};

export const checkEmptyChildren = (schema: Schema, entry?: SchemaEntry) => {
  if (!entry) return false;

  const isUIControl = UI_CONTROLS_LIST.includes(entry.type as AdvancedFieldType);
  if (isUIControl) return false;

  return entry.children?.every(id => !schema.get(id)) ?? false;
};
