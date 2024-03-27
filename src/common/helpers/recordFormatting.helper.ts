import { cloneDeep } from 'lodash';
import { FORCE_INCLUDE_WHEN_DEPARSING, WORK_TO_INSTANCE_FIELDS } from '@common/constants/bibframe.constants';
import {
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
  updatedRecord = updateWorkWithInstanceFields(updatedRecord) as unknown as Record<string, RecursiveRecordSchema[]>;

  const instanceWithUpdatedNotes = updateRecordWithDefaultNoteType(updatedRecord);

  return updateRecordWithRelationshipDesignator(instanceWithUpdatedNotes, FORCE_INCLUDE_WHEN_DEPARSING);

  // return instanceWithUpdatedNotes;
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
      type: note['http://id.loc.gov/ontologies/bibframe/noteType'],
      value: note['http://bibfra.me/vocab/lite/note'],
    }));

    delete recordEntry[BFLITE_URIS.NOTE];
  });

  return record;
};

export const updateRecordWithDefaultNoteType = (
  record: Record<string, RecursiveRecordSchema | RecursiveRecordSchema[]>,
) => {
  const typedNotes = record?.[NON_BF_RECORD_ELEMENTS[BFLITE_URIS.NOTE].container] as unknown as RecursiveRecordSchema[];

  typedNotes?.forEach(noteRecord => {
    if (!noteRecord.type) {
      noteRecord.type = [BFLITE_URIS.NOTE];
    }
  });

  return record;
};

export const updateRecordWithRelationshipDesignator = (
  record: Record<string, RecursiveRecordSchema | RecursiveRecordSchema[]>,
  fieldUirs: string[],
) => {
  const workComponent = record?.[BFLITE_URIS.WORK as string] as unknown as Record<string, unknown>;
  const roleBF2Uri = 'http://id.loc.gov/ontologies/bibframe/role';
  const nameBF2Uri = 'http://bibfra.me/vocab/lite/name';

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
        const id = (field[key]?.[nameBF2Uri]?.[0] as unknown as Record<string, string[]>)?.id?.[0];
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

export const updateWorkWithInstanceFields = (
  record: Record<string, RecursiveRecordSchema | RecursiveRecordSchema[]>,
) => {
  const typedRecord = record as Record<string, RecursiveRecordSchema>;
  const workComponent = typedRecord?.[BFLITE_URIS.WORK as string];
  const workComponentTyped = workComponent as unknown as Record<string, unknown>;

  WORK_TO_INSTANCE_FIELDS.forEach(fieldName => {
    const componentToMove = typedRecord?.[BFLITE_URIS.INSTANCE]?.[fieldName];

    if (!componentToMove) return;

    const updatedWorkData = workComponent
      ? ({ ...workComponentTyped, [fieldName]: componentToMove } as RecursiveRecordSchema)
      : ({ [fieldName]: componentToMove } as RecursiveRecordSchema);

    record[BFLITE_URIS.WORK as string] = updatedWorkData;

    delete typedRecord?.[BFLITE_URIS.INSTANCE]?.[fieldName];
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
