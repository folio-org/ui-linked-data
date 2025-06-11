export enum AdvancedFieldType {
  profile = 'profile',
  block = 'block',
  group = 'group',
  literal = 'literal',
  simple = 'simple',
  complex = 'complex',
  groupComplex = 'groupComplex',
  hidden = 'hidden',
  dropdown = 'dropdown',
  dropdownOption = 'dropdownOption',
  __fallback = '__fallback',
}

export enum SchemaControlType {
  Duplicate = 'addDuplicate',
  RemoveDuplicate = 'removeDuplicate',
  ChangeComplexFieldValue = 'changeComplexFieldValue',
}

const BASE_UI_CONTROLS_LIST = [AdvancedFieldType.literal, AdvancedFieldType.simple, AdvancedFieldType.complex];

export const UI_CONTROLS_LIST = [...BASE_UI_CONTROLS_LIST, AdvancedFieldType.dropdown];

export const NOT_PREVIEWABLE_TYPES = [
  AdvancedFieldType.profile,
  AdvancedFieldType.block,
  AdvancedFieldType.hidden,
  AdvancedFieldType.dropdownOption,
  AdvancedFieldType.complex,
];
