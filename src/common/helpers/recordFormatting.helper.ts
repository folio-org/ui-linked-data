import { cloneDeep } from 'lodash';
import { FORCE_INCLUDE_WHEN_DEPARSING, PROVISION_ACTIVITY_OPTIONS } from '@common/constants/bibframe.constants';
import {
  BF2_URIS,
  BFLITE_URIS,
  NON_BF_RECORD_CONTAINERS,
  NON_BF_RECORD_ELEMENTS,
} from '@common/constants/bibframeMapping.constants';

export const formatRecord = ({
  parsedRecord,
  record,
  selectedRecordBlocks,
}: {
  parsedRecord: ParsedRecord;
  record: RecordEntry | null;
  selectedRecordBlocks?: SelectedRecordBlocks;
}) => {
  const defaultFormattedRecord = { resource: {} };

  if (!parsedRecord || !selectedRecordBlocks) return defaultFormattedRecord;

  const { block, reference } = selectedRecordBlocks;

  if (!block || !reference) return defaultFormattedRecord;

  const updatedBlocks = getUpdatedRecordBlocks(parsedRecord as unknown as Record<string, RecursiveRecordSchema[]>);
  const referenceIds = record ? getReferenceIds(record, block, reference.key) : undefined;
  const blockValues = { ...updatedBlocks?.[block] } as unknown as Record<string, RecordEntry[]>;

  if (referenceIds) {
    blockValues[reference.key] = referenceIds;
  }

  return {
    resource: {
      [block]: blockValues,
    },
  };
};

const getReferenceIds = (record: RecordEntry, block: string, referenceKey: string) => {
  const typedReferenceBlock = record.resource?.[block]?.[referenceKey] as unknown as Record<string, RecordEntry>[];

  return typedReferenceBlock?.map(({ id }) => ({ id }));
};

// TODO: refactor this to make the processing consistent
const getUpdatedRecordBlocks = (instanceComponent: Record<string, RecursiveRecordSchema[]>) => {
  let updatedRecord = cloneDeep(instanceComponent) as Record<string, RecursiveRecordSchema[]>;

  updatedRecord = updateRecordWithNotes(updatedRecord) as unknown as Record<string, RecursiveRecordSchema[]>;
  updatedRecord = updateRecordForTargetAudience(updatedRecord) as unknown as Record<string, RecursiveRecordSchema[]>;
  updatedRecord = updateRecordForProviderPlace(updatedRecord) as unknown as Record<string, RecursiveRecordSchema[]>;
  updatedRecord = updateRecordForClassification(updatedRecord) as unknown as Record<string, RecursiveRecordSchema[]>;

  return updateRecordWithRelationshipDesignator(updatedRecord, FORCE_INCLUDE_WHEN_DEPARSING);
};

export const updateRecordWithNotes = (record: Record<string, RecursiveRecordSchema | RecursiveRecordSchema[]>) => {
  const instanceComponent = record[BFLITE_URIS.INSTANCE as string] as unknown as Record<string, unknown>;
  const workComponent = record[BFLITE_URIS.WORK as string] as unknown as Record<string, unknown>;
  const instanceNote = instanceComponent[BFLITE_URIS.NOTE];
  const workNote = workComponent[BFLITE_URIS.NOTE];

  if (!instanceNote && !workNote) return record;

  const blocksList = [instanceComponent, workComponent];

  blocksList.forEach(recordEntry => {
    const noteEntry = recordEntry[BFLITE_URIS.NOTE] as RecordBasic[];

    if (!noteEntry) return;

    recordEntry[NON_BF_RECORD_ELEMENTS[BFLITE_URIS.NOTE].container] = noteEntry?.map(note => ({
      type: note[BF2_URIS.NOTE_TYPE] ?? [BFLITE_URIS.NOTE],
      value: note[BFLITE_URIS.NOTE],
    }));

    delete recordEntry[BFLITE_URIS.NOTE];
  });

  return record;
};

export const updateRecordWithRelationshipDesignator = (
  record: Record<string, RecursiveRecordSchema | RecursiveRecordSchema[]>,
  fieldUirs: string[],
) => {
  const workComponent = record?.[BFLITE_URIS.WORK as string] as unknown as Record<string, unknown>;
  const roleBF2Uri = 'http://id.loc.gov/ontologies/bibframe/role';

  fieldUirs.forEach(fieldName => {
    const recordFields = workComponent?.[fieldName] as RecordEntry[] | undefined;

    if (!recordFields) return;

    const nonBFMappedContainer = NON_BF_RECORD_ELEMENTS[fieldName]?.container;

    recordFields.forEach(field => {
      const fieldKeys = Object.keys(field);
      const hasRoles =
        (nonBFMappedContainer && fieldKeys.includes(nonBFMappedContainer)) || fieldKeys.includes(roleBF2Uri);

      if (!hasRoles) return;

      const roles = field[nonBFMappedContainer] || field[roleBF2Uri];
      delete field[nonBFMappedContainer];
      delete field[roleBF2Uri];

      for (const key in field) {
        const id = (field[key]?.[BFLITE_URIS.NAME]?.[0] as unknown as Record<string, string[]>)?.id?.[0];
        const existingData = workComponent[NON_BF_RECORD_CONTAINERS[fieldName]?.container] as Record<
          string,
          string | string[]
        >[];

        workComponent[NON_BF_RECORD_CONTAINERS[fieldName]?.container] = existingData
          ? [...existingData, { id, roles }]
          : [{ id, roles }];
      }

      delete workComponent[fieldName];
    });
  });

  return record;
};

export const updateRecordForTargetAudience = (
  record: Record<string, RecursiveRecordSchema | RecursiveRecordSchema[]>,
) => {
  // TODO: add suport for this field
  const workComponent = record[BFLITE_URIS.WORK as string] as unknown as Record<string, unknown>;
  const audienceBF2Uri = 'http://id.loc.gov/ontologies/bibframe/intendedAudience';

  if (workComponent?.[audienceBF2Uri]) {
    delete workComponent[audienceBF2Uri];
  }

  return record;
};

export const updateRecordForProviderPlace = (
  record: Record<string, RecursiveRecordSchema | RecursiveRecordSchema[]>,
) => {
  const instanceComponent = record?.[BFLITE_URIS.INSTANCE as string] as unknown as Record<
    string,
    Array<{
      [key: string]: string[] | Record<string, string[]>[];
    }>
  >;
  const providerPlaceUri = BFLITE_URIS.PROVIDER_PLACE;

  PROVISION_ACTIVITY_OPTIONS.forEach(option => {
    if (!instanceComponent[option]) return;

    instanceComponent[option].forEach(recordProvisionActivity => {
      if (!recordProvisionActivity?.[providerPlaceUri]) return;

      recordProvisionActivity[providerPlaceUri] = (
        recordProvisionActivity?.[providerPlaceUri] as Record<string, string[]>[]
      )?.map(data => ({
        ...data,
        [BFLITE_URIS.NAME]: data[BFLITE_URIS.LABEL],
      }));
    });
  });

  return record;
};

export const updateRecordForClassification = (
  record: Record<string, RecursiveRecordSchema | RecursiveRecordSchema[]>,
) => {
  const workComponent = record?.[BFLITE_URIS.WORK as string] as unknown as Record<
    string,
    Record<string, RecordBasic>[]
  >;
  const classificationData = workComponent?.[BFLITE_URIS.CLASSIFICATION];

  if (!classificationData) return record;

  workComponent[BFLITE_URIS.CLASSIFICATION] = classificationData?.map(data => {
    let updatedElem = {};

    for (const key in data) {
      updatedElem = { ...data[key], [BFLITE_URIS.SOURCE]: [key] };
    }

    return updatedElem;
  });

  return record;
};

export const getNonBFMapElemByContainerKey = (
  nonMappedGroup: Record<string, NonBFMappedGroupData>,
  containerKey: string,
) => {
  let groupElemKey;
  let groupElemValue;

  for (const key in nonMappedGroup) {
    const groupElem = nonMappedGroup[key];
    const altKeys = groupElem.container?.altKeys;

    if (altKeys && Object.values(altKeys).includes(containerKey)) {
      groupElemKey = key;
      groupElemValue = groupElem;
    }
  }

  return { key: groupElemKey, value: groupElemValue };
};
