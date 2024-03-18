import { cloneDeep, isEmpty } from 'lodash';
import { FORCE_INCLUDE_WHEN_DEPARSING, INSTANTIATES_TO_INSTANCE_FIELDS } from '@common/constants/bibframe.constants';
import { BFLITE_URIS, NON_BF_GROUP_TYPE, NON_BF_RECORD_ELEMENTS } from '@common/constants/bibframeMapping.constants';

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

  if (!record || !selectedRecordBlocks) return defaultFormattedRecord;

  const { block, reference } = selectedRecordBlocks;

  if (!block || !reference) return defaultFormattedRecord;

  const updatedBlocks = getUpdatedRecordBlocks(parsedRecord as unknown as Record<string, RecursiveRecordSchema[]>);
  const referenceIds = getReferenceIds(record, block, reference.key);
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

  const instanceWithUpdatedNotes = updateRecordWithDefaultNoteType(updatedRecord);

  return updateRecordWithRelationshipDesignator(instanceWithUpdatedNotes, FORCE_INCLUDE_WHEN_DEPARSING);
};

export const updateInstantiatesWithInstanceFields = (
  instanceComponent: Record<string, RecursiveRecordSchema[] | RecursiveRecordSchema>,
) => {
  const instantiatesComponent = instanceComponent?.[BFLITE_URIS.INSTANTIATES as string];
  const instantiatesComponentTyped = instantiatesComponent as unknown as Record<string, unknown>[];

  INSTANTIATES_TO_INSTANCE_FIELDS.forEach(fieldName => {
    const componentToMove = instanceComponent?.[fieldName];

    if (!componentToMove) return;

    if (instantiatesComponent) {
      instantiatesComponentTyped[0] = { ...instantiatesComponentTyped[0], [fieldName]: componentToMove };
    } else {
      instanceComponent[BFLITE_URIS.INSTANTIATES as string] = [
        { [fieldName]: componentToMove } as RecursiveRecordSchema,
      ];
    }

    delete instanceComponent[fieldName];
  });

  return instanceComponent;
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

      if (isEmpty(field)) {
        // Find the mapped field with the mapped dropdown options.
        const nonBFMapElem = getNonBFMapElemByContainerKey(
          NON_BF_GROUP_TYPE as unknown as Record<string, NonBFMappedGroupData>,
          fieldName,
        );

        // Add "_roles" to a default dropdown option.
        if (!nonBFMapElem.key || !nonBFMapElem.value || !nonBFMapElem.value?.options) return;

        const optionURIsList = Object.values(nonBFMapElem.value.options);

        if (!optionURIsList || !optionURIsList.length) return;

        const optionUri = optionURIsList[0].key;

        if (!optionUri) return;

        field[optionUri] = { [nonBFMappedContainer]: roles };
      } else {
        // Add "_roles" to the selected dropdown option
        for (const key in field) {
          field[key] = { ...field[key], [nonBFMappedContainer]: roles };
        }
      }
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
