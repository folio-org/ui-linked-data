import { cloneDeep } from 'lodash';

import {
  INSTANCE_CLONE_DELETE_PROPERTIES,
  TITLE_CONTAINER_URIS,
  TYPE_URIS,
} from '@/common/constants/bibframe.constants';
import { BFLITE_URIS, BLOCKS_BFLITE, REF_TO_NAME } from '@/common/constants/bibframeMapping.constants';
import { QueryParams } from '@/common/constants/routes.constants';
import {
  getProfileBfid,
  getReference,
  getUri,
  hasReference,
  mapToResourceType,
  mapUriToResourceType,
} from '@/configs/resourceTypes';

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

export const getPrimaryEntitiesFromRecord = (record: RecordEntry, editable = true) => {
  if (!record) {
    return [getProfileBfid(undefined)];
  }

  const recordContents = record.resource ?? record;

  if (!recordContents || typeof recordContents !== 'object' || !Object.keys(recordContents).length) {
    // Fallback for empty records (e.g., during Create mode before data is loaded)
    return [getProfileBfid(undefined)];
  }

  const { block } = getEditingRecordBlocks(recordContents as RecordEntry);

  if (!block) {
    return [getProfileBfid(undefined)];
  }

  const resourceType = mapUriToResourceType(block);

  // For editable mode, return the main entity's profile BFID
  // For preview mode (!editable), return the reference target's profile BFID if it exists
  if (editable || !hasReference(resourceType)) {
    return [getProfileBfid(resourceType)];
  }

  return [getProfileBfid(getReference(resourceType)?.targetType)];
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
  const typeParam = searchParams?.get(QueryParams.Type);
  const resourceType = mapToResourceType(typeParam);

  return {
    block: getUri(resourceType),
    reference: getReference(resourceType),
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

  // Delete unique admin metadata values to avoid colliding with
  // the clone source's local control number and to not use a past date
  if (asClone && block === BFLITE_URIS.INSTANCE && adjustedRecord[block][BFLITE_URIS.ADMIN_METADATA]) {
    INSTANCE_CLONE_DELETE_PROPERTIES.forEach(property => {
      delete (adjustedRecord[block][BFLITE_URIS.ADMIN_METADATA] as unknown as any[])?.[0]?.[property];
    });
  }

  return {
    record: adjustedRecord,
  };
};

export const unwrapRecordValuesFromCommonContainer = (record: RecordEntry) =>
  (record.resource ?? record) as RecordEntry;

export const wrapRecordValuesWithCommonContainer = (record: RecordEntry) => ({ resource: record });

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

export const hasAllEmptyValues = (values: UserValueContents[]) => {
  return values.every(({ label }) => label === '' || label === undefined);
};

export const getRecordProfileId = (record?: RecordEntry<RecursiveRecordSchema> | null) => {
  const recordData = record?.resource ?? {};
  let selectedProfileId: string | number | null | undefined;

  if (recordData && Object.keys(recordData).length) {
    const { block } = getEditingRecordBlocks(recordData as RecordEntry);

    if (block) {
      selectedProfileId = record?.resource[block]?.profileId as number | undefined;
    }
  }

  return selectedProfileId;
};
