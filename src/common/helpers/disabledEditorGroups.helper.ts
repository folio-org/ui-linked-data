import { PROFILE_BFIDS } from '@common/constants/bibframe.constants';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';

const DISABLED_FIELD_TYPES = [
  AdvancedFieldType.literal,
  AdvancedFieldType.simple,
  AdvancedFieldType.complex,
  AdvancedFieldType.dropdown,
];

const DISABLED_PARENT_BFIDS = [PROFILE_BFIDS.WORK];

export const getComplexLookups = (schema: Schema) =>
  Array.from(schema.values()).filter(({ type }) => type === AdvancedFieldType.complex);

export const getDisabledParentDescendants = (schema: Schema) => {
  const schemaValues = Array.from(schema.values());
  const parentUuids = schemaValues.reduce((acc: any, { uuid, bfid }) => {
    if (bfid && DISABLED_PARENT_BFIDS.includes(bfid)) {
      return [...acc, uuid];
    }

    return acc;
  }, []);

  return schemaValues.filter(({ path }) => path.some(pathEntry => parentUuids.includes(pathEntry)));
};

export const getGroupsWithComplexLookups = (complexLookupFields: SchemaEntry[], schema: Schema) =>
  complexLookupFields.map(({ path }) =>
    path.reduce((accum, current) => {
      const entry = schema.get(current);

      if (entry?.type === AdvancedFieldType.group || entry?.type === AdvancedFieldType.groupComplex) {
        accum = entry;
      }

      return accum;
    }, null as SchemaEntry | null),
  );

export const getDisabledFieldsWithinGroup = (schema: Schema, childElements: string[] | undefined, fields?: Schema) => {
  const disabledFields = fields ?? new Map();

  childElements?.forEach(elementId => {
    const schemaElem = schema.get(elementId);

    if (!schemaElem || !schemaElem.type) return;

    if (DISABLED_FIELD_TYPES.includes(schemaElem.type as AdvancedFieldType)) {
      disabledFields.set(schemaElem.uuid, schemaElem);
    }

    if (schemaElem.children) {
      getDisabledFieldsWithinGroup(schema, schemaElem.children, disabledFields);
    }
  });

  return disabledFields;
};

export const getAllDisabledFields = (schema: Schema) => {
  const complexLookupFields = getComplexLookups(schema);
  const disabledParentDescendants = getDisabledParentDescendants(schema);

  const disabledFields = new Map();

  if (complexLookupFields.length) {
    const complexLookupGroups = getGroupsWithComplexLookups(complexLookupFields, schema);

    complexLookupGroups.forEach(group => {
      const disabledFieldsWithinGroup = getDisabledFieldsWithinGroup(schema, group?.children);

      disabledFieldsWithinGroup.forEach((disabledField, key) => disabledFields.set(key, disabledField));
    });
  }

  if (disabledParentDescendants.length) {
    disabledParentDescendants.forEach(disabledField => disabledFields.set(disabledField.uuid, disabledField));
  }

  return disabledFields;
};
