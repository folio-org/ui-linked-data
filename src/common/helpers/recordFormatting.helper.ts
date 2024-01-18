import { cloneDeep, isEmpty } from 'lodash';
import {
  FORCE_INCLUDE_WHEN_DEPARSING,
  INSTANTIATES_TO_INSTANCE_FIELDS,
  TYPE_URIS,
} from '@common/constants/bibframe.constants';
import { BFLITE_URIS, NON_BF_GROUP_TYPE, NON_BF_RECORD_ELEMENTS } from '@common/constants/bibframeMapping.constants';

export const formatRecord = (parsedRecord: ParsedRecord) => {
  const workComponent = parsedRecord[BFLITE_URIS.INSTANTIATES] as unknown as RecursiveRecordSchema[];
  const instanceComponent = parsedRecord[TYPE_URIS.INSTANCE] as unknown as Record<string, RecursiveRecordSchema[]>;

  if (workComponent && Object.keys(workComponent).length && instanceComponent) {
    instanceComponent[BFLITE_URIS.INSTANTIATES as string] = [workComponent] as unknown as RecursiveRecordSchema[];
  }

  delete parsedRecord[BFLITE_URIS.INSTANTIATES];

  return {
    resource: {
      ...parsedRecord,
      [TYPE_URIS.INSTANCE]: getUpdatedInstance(instanceComponent),
    },
  };
};

const getUpdatedInstance = (instanceComponent: Record<string, RecursiveRecordSchema[]>) => {
  const instanceField = updateInstantiatesWithInstanceFields(instanceComponent);
  const instanceWithUpdatedNotes = updateRecordWithDefaultNoteType(instanceField);

  return updateRecordWithRelationshipDesignator(instanceWithUpdatedNotes, FORCE_INCLUDE_WHEN_DEPARSING);
};

export const updateInstantiatesWithInstanceFields = (
  instanceComponent: Record<string, RecursiveRecordSchema[] | RecursiveRecordSchema>,
) => {
  const clonedInstance = cloneDeep(instanceComponent);
  const instantiatesComponent = clonedInstance[BFLITE_URIS.INSTANTIATES as string];
  const instantiatesComponentTyped = instantiatesComponent as unknown as Record<string, unknown>[];

  INSTANTIATES_TO_INSTANCE_FIELDS.forEach(fieldName => {
    const componentToMove = clonedInstance[fieldName];

    if (!componentToMove) return;

    if (instantiatesComponent) {
      instantiatesComponentTyped[0] = { ...instantiatesComponentTyped[0], [fieldName]: componentToMove };
    } else {
      clonedInstance[BFLITE_URIS.INSTANTIATES as string] = [{ [fieldName]: componentToMove } as RecursiveRecordSchema];
    }

    delete clonedInstance[fieldName];
  });

  return clonedInstance;
};

export const updateRecordWithDefaultNoteType = (
  record: Record<string, RecursiveRecordSchema | RecursiveRecordSchema[]>,
) => {
  const clonedRecord = cloneDeep(record);
  const typedNotes = clonedRecord[
    NON_BF_RECORD_ELEMENTS[BFLITE_URIS.NOTE].container
  ] as unknown as RecursiveRecordSchema[];

  typedNotes?.forEach(noteRecord => {
    if (!noteRecord.type) {
      noteRecord.type = [BFLITE_URIS.NOTE];
    }
  });

  return clonedRecord;
};

export const updateRecordWithRelationshipDesignator = (
  record: Record<string, RecursiveRecordSchema | RecursiveRecordSchema[]>,
  fieldUirs: string[],
) => {
  const clonedInstance = cloneDeep(record);
  const instantiatesComponent = clonedInstance[BFLITE_URIS.INSTANTIATES as string] as unknown as Record<
    string,
    unknown
  >[];

  fieldUirs.forEach(fieldName => {
    const recordFields = instantiatesComponent?.[0]?.[fieldName] as RecordEntry[] | undefined;

    if (!recordFields) return;

    const nonBFMappedContainer = NON_BF_RECORD_ELEMENTS[fieldName]?.container;

    recordFields.forEach(field => {
      const fieldKeys = Object.keys(field);
      const hasRoles = nonBFMappedContainer && fieldKeys.includes(nonBFMappedContainer);

      if (!hasRoles) return;

      const roles = field[nonBFMappedContainer];
      delete field[nonBFMappedContainer];

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

  return clonedInstance;
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
