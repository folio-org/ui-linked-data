import { AdvancedFieldType } from '@common/constants/uiControls.constants';

const DISABLED_FIELD_TYPES = [
  AdvancedFieldType.literal,
  AdvancedFieldType.simple,
  AdvancedFieldType.complex,
  AdvancedFieldType.dropdown,
];

export const getComplexLookups = (schema: Schema) => {
  return Array.from(schema.values()).filter(elem => elem.type === AdvancedFieldType.complex);
};

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

export const traverseGroup = (schema: Schema, disabledFields: Schema, childElements: string[] | undefined) => {
  childElements?.forEach(element => {
    const schemaElem = schema.get(element);

    if (!schemaElem || !schemaElem.type) return;

    if (DISABLED_FIELD_TYPES.includes(schemaElem.type as AdvancedFieldType)) {
      disabledFields.set(schemaElem.uuid, schemaElem);
    }

    if (schemaElem.children) {
      traverseGroup(schema, disabledFields, schemaElem.children);
    }
  });
};

export const getDisabledFields = (schema: Schema) => {
  const complexLookupFields = getComplexLookups(schema);
  const disabledFields = new Map();

  if (complexLookupFields.length) {
    const complexLookupGroups = getGroupsWithComplexLookups(schema, complexLookupFields);

    complexLookupGroups.forEach(group => {
      traverseGroup(schema, disabledFields, group?.children);
    });
  }

  return disabledFields;
};
