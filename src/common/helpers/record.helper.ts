import { cloneDeep } from 'lodash';
import { PROFILE_BFIDS, TITLE_CONTAINER_URIS, TYPE_URIS } from '@common/constants/bibframe.constants';
import { BFLITE_URIS, BLOCKS_BFLITE, REF_TO_NAME } from '@common/constants/bibframeMapping.constants';
import { ResourceType } from '@common/constants/record.constants';
import { QueryParams } from '@common/constants/routes.constants';

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
