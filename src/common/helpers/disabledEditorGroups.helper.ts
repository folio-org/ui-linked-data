import { AdvancedFieldType } from '@common/constants/uiControls.constants';

const DISABLED_FIELD_TYPES = [
  AdvancedFieldType.literal,
  AdvancedFieldType.simple,
  AdvancedFieldType.complex,
  AdvancedFieldType.dropdown,
];

export const getComplexLookups = (schema: Schema) =>
  Array.from(schema.values()).filter(({ type }) => type === AdvancedFieldType.complex);

export const getGroupsWithComplexLookups = (schema: Schema, complexLookupFields: SchemaEntry[]) =>
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

  childElements?.forEach(element => {
    const schemaElem = schema.get(element);

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
  const disabledFields = new Map();

  if (complexLookupFields.length) {
    const complexLookupGroups = getGroupsWithComplexLookups(schema, complexLookupFields);

    complexLookupGroups.forEach(group => {
      const disabledFieldsWithinGroup = getDisabledFieldsWithinGroup(schema, group?.children);

      disabledFieldsWithinGroup.forEach((disabledField, key) => disabledFields.set(key, disabledField));
    });
  }

  return disabledFields;
};
