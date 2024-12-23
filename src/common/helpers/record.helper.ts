import {
  GROUP_BY_LEVEL,
  GROUP_CONTENTS_LEVEL,
  IDENTIFIER_AS_VALUE,
  PROFILE_BFIDS,
  TITLE_CONTAINER_URIS,
  TYPE_URIS,
} from '@common/constants/bibframe.constants';
import {
  BFLITE_URI_TO_BLOCK,
  BFLITE_URIS,
  BLOCKS_BFLITE,
  REF_TO_NAME,
} from '@common/constants/bibframeMapping.constants';
import { ResourceType } from '@common/constants/record.constants';
import { QueryParams } from '@common/constants/routes.constants';
import { cloneDeep } from 'lodash';
import { NOT_PREVIEWABLE_TYPES, AdvancedFieldType } from '@common/constants/uiControls.constants';
import { PREVIEW_ALT_DISPLAY_LABELS } from '@common/constants/uiElements.constants';

type IGetAdjustedRecordContents = {
  record: RecordEntry;
  block?: string;
  reference?: RecordReference;
  asClone?: boolean;
};

export const getRecordId = (record: RecordEntry | null, selectedBlock?: string, previewBlock?: string) => {
  const block = selectedBlock ?? TYPE_URIS.INSTANCE;

  return previewBlock ? (record?.resource?.[block]?.[previewBlock] as any[])?.[0]?.id : record?.resource?.[block]?.id;
};

export const checkIdentifierAsValue = (record: Record<string, string[]>, uri: string) => {
  const identifierAsValueSelection = IDENTIFIER_AS_VALUE[uri];

  if (identifierAsValueSelection) {
    const { field, value } = identifierAsValueSelection;

    if (record?.[field]?.includes(value)) {
      return record;
    }
  }

  return false;
};

export const getPrimaryEntitiesFromRecord = (record: RecordEntry, editable = true) => {
  const isInstance = record?.resource[TYPE_URIS.INSTANCE];
  const workAsPrimary = editable ? [PROFILE_BFIDS.WORK] : [PROFILE_BFIDS.INSTANCE];
  const instanceAsPrimary = editable ? [PROFILE_BFIDS.INSTANCE] : [PROFILE_BFIDS.WORK];

  return isInstance ? instanceAsPrimary : workAsPrimary;
};

export const getEditingRecordBlocks = (record: RecordEntry) => {
  const typedBlocksList = BLOCKS_BFLITE as RecordBlocksBFLite;

  let block;
  let reference;

  for (const key in typedBlocksList) {
    const blockItem = typedBlocksList[key];

    if (!record[blockItem.uri]) continue;

    block = blockItem.uri;
    reference = blockItem.reference;
  }

  return { block, reference };
};

export const getSelectedRecordBlocks = (searchParams: URLSearchParams) => {
  const isInstancePageType = searchParams?.get(QueryParams.Type) === ResourceType.instance;
  const block = isInstancePageType ? BLOCKS_BFLITE.INSTANCE.uri : BLOCKS_BFLITE.WORK.uri;
  const reference = isInstancePageType ? BLOCKS_BFLITE.INSTANCE.reference : BLOCKS_BFLITE.WORK.reference;

  return {
    block,
    reference,
  };
};

export const getRecordTitle = (record: RecordEntry) => {
  // TODO: UILD-442 - unify interactions with record and its format
  // Some functions expect { resource: { %RECORD_CONTENTS% }}
  // Others, like this one, expect { %RECORD_CONTENTS% }
  const recordContents = unwrapRecordValuesFromCommonContainer(record);

  const { block } = getEditingRecordBlocks(recordContents);

  let selectedTitle;

  TITLE_CONTAINER_URIS.every(uri => {
    const selectedTitleContainer = (
      recordContents[block!]?.[BFLITE_URIS.TITLE] as unknown as Record<string, unknown>[]
    )?.find(obj => Object.hasOwn(obj, uri));

    if (selectedTitleContainer) {
      selectedTitle = selectedTitleContainer[uri];
    }

    return !selectedTitleContainer;
  });

  return selectedTitle?.[BFLITE_URIS.MAIN_TITLE]?.[0];
};

export const getAdjustedRecordContents = ({ record, block, reference, asClone }: IGetAdjustedRecordContents) => {
  const adjustedRecord = cloneDeep(record);

  // Remove dependencies from a resource of type Work when cloning
  if (asClone && block === BFLITE_URIS.WORK && reference?.key) {
    delete adjustedRecord[block][reference.key];
  }

  return {
    record: adjustedRecord,
  };
};

export const unwrapRecordValuesFromCommonContainer = (record: RecordEntry) =>
  (record.resource ?? record) as RecordEntry;

export const wrapRecordValuesWithCommonContainer = (record: RecordEntry) => ({ resource: record });

export const checkIfRecordHasDependencies = (record: RecordEntry) => {
  if (!record?.resource) return false;

  for (const [key, val] of Object.entries(record.resource)) {
    if (val[BFLITE_URI_TO_BLOCK[key as keyof typeof BFLITE_URI_TO_BLOCK]?.reference?.key]) return true;
  }

  return false;
};

export const getRecordPropertyData = (property: string[] | string) => {
  return Array.isArray(property) ? property[0] : property;
};

export const getPreviewFieldsConditions = ({
  entry,
  level,
  userValues,
  uuid,
  schema,
  isOnBranchWithUserValue,
  altDisplayNames,
  hideEntities,
  isEntity,
  forceRenderAllTopLevelEntities,
}: {
  entry: SchemaEntry;
  level: number;
  userValues: UserValues;
  uuid: string;
  schema: Schema;
  isOnBranchWithUserValue: boolean;
  altDisplayNames?: Record<string, string>;
  hideEntities?: boolean;
  isEntity: boolean;
  forceRenderAllTopLevelEntities?: boolean;
}) => {
  const { displayName = '', children, type, bfid = '', linkedEntry } = entry;

  const isPreviewable = !NOT_PREVIEWABLE_TYPES.includes(type as AdvancedFieldType);
  const isGroupable = level <= GROUP_BY_LEVEL;
  const hasChildren = children?.length;
  const selectedUserValues = userValues[uuid];
  const isBranchEnd = !hasChildren;
  const isBranchEndWithoutValues = !selectedUserValues && isBranchEnd;
  const isBranchEndWithValues = !!selectedUserValues;
  const shouldRenderLabelOrPlaceholders =
    (!(isEntity && hideEntities) && isPreviewable && isGroupable) ||
    type === AdvancedFieldType.dropdown ||
    (isBranchEndWithValues && type !== AdvancedFieldType.complex) ||
    isBranchEndWithoutValues;
  const hasOnlyDropdownChildren =
    hasChildren &&
    !children.filter(childUuid => schema.get(childUuid)?.type !== AdvancedFieldType.dropdownOption).length;
  const shouldRenderValuesOrPlaceholders = !hasChildren || hasOnlyDropdownChildren;
  const shouldRenderPlaceholders =
    (isPreviewable && isGroupable && !isOnBranchWithUserValue) || !isOnBranchWithUserValue;
  const isDependentDropdown = type === AdvancedFieldType.dropdown && !!linkedEntry?.controlledBy;
  const displayNameWithAltValue =
    altDisplayNames?.[displayName] ?? PREVIEW_ALT_DISPLAY_LABELS[displayName] ?? displayName;
  const isBlock = level === GROUP_BY_LEVEL && shouldRenderLabelOrPlaceholders;
  const isBlockContents = level === GROUP_CONTENTS_LEVEL;
  const isInstance = bfid === PROFILE_BFIDS.INSTANCE;
  const wrapEntities = forceRenderAllTopLevelEntities && isEntity;

  return {
    isGroupable,
    shouldRenderLabelOrPlaceholders,
    shouldRenderValuesOrPlaceholders,
    shouldRenderPlaceholders,
    isDependentDropdown,
    displayNameWithAltValue,
    isBlock,
    isBlockContents,
    isInstance,
    wrapEntities,
  };
};

export const getRecordDependencies = (record?: RecordEntry | null) => {
  if (!record) return;

  const contents = unwrapRecordValuesFromCommonContainer(record);
  const { block, reference } = getEditingRecordBlocks(contents);

  if (block && reference) {
    return {
      keys: reference,
      type: REF_TO_NAME[reference.key as keyof typeof REF_TO_NAME],
      entries: contents[block][reference.key] as unknown as RecursiveRecordSchema[],
    };
  }
};
