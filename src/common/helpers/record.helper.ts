import { AUTOCLEAR_TIMEOUT } from '@common/constants/storage.constants';
import { localStorageService } from '@common/services/storage';
import { generateRecordBackupKey } from './progressBackup.helper';
import {
  IDENTIFIER_AS_VALUE,
  PROFILE_BFIDS,
  TITLE_CONTAINER_URIS,
  TYPE_URIS,
} from '@common/constants/bibframe.constants';
import { formatRecord } from './recordFormatting.helper';
import { BFLITE_URI_TO_BLOCK, BFLITE_URIS, BLOCKS_BFLITE } from '@common/constants/bibframeMapping.constants';
import { ResourceType } from '@common/constants/record.constants';
import { QueryParams } from '@common/constants/routes.constants';
import { cloneDeep } from 'lodash';

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

export const getRecordWithUpdatedID = (record: RecordEntry, id: RecordID) => ({
  resource: {
    ...record.resource,
    [TYPE_URIS.INSTANCE]: { ...record.resource[TYPE_URIS.INSTANCE], id },
  },
});

export const deleteRecordLocally = (profile: string, recordId?: RecordID) => {
  const storageKey = generateRecordBackupKey(profile, recordId);

  localStorageService.delete(storageKey);
};

export const generateRecordData = (record: ParsedRecord) => {
  return {
    createdAt: new Date().getTime(),
    data: record,
  };
};

export const generateAndSaveRecord = (storageKey: string, record: ParsedRecord) => {
  const newRecord = generateRecordData(record);

  localStorageService.serialize(storageKey, newRecord);

  return newRecord;
};

export const saveRecordLocally = ({
  profile,
  parsedRecord,
  record,
  selectedRecordBlocks,
}: {
  profile: string;
  parsedRecord: ParsedRecord;
  record: RecordEntry | null;
  selectedRecordBlocks?: SelectedRecordBlocks;
}) => {
  if (!record) return;

  const recordId = getRecordId(record) as string;
  const storageKey = generateRecordBackupKey(profile, recordId);
  const formattedRecord = formatRecord({ parsedRecord, record, selectedRecordBlocks });
  const updatedRecord = getRecordWithUpdatedID(formattedRecord as RecordEntry, recordId);

  return generateAndSaveRecord(storageKey, updatedRecord as ParsedRecord);
};

export const getSavedRecord = (profile: string, recordId?: RecordID): LocallySavedRecord | null => {
  const storageKey = generateRecordBackupKey(profile, recordId);
  const savedRecordData = localStorageService.deserialize(storageKey);

  if (savedRecordData && !savedRecordData?.data) {
    return generateAndSaveRecord(storageKey, savedRecordData);
  }

  return savedRecordData ? autoClearSavedData(savedRecordData, profile, recordId) : null;
};

export const autoClearSavedData = (savedRecordData: LocallySavedRecord, profile: string, recordId?: RecordID) => {
  const shouldBeCleared = savedRecordData.createdAt + AUTOCLEAR_TIMEOUT <= new Date().getTime();

  if (!shouldBeCleared) return savedRecordData;

  deleteRecordLocally(profile, recordId);

  return null;
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
  // TODO: unify interactions with record and its format
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
