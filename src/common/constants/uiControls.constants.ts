export enum BaseFieldType {
  META = 'META',
  HIDE = 'HIDE',
  REF = 'REF',
  LITERAL = 'LITERAL',
  SIMPLE = 'SIMPLE',
  COMPLEX = 'COMPLEX',
  UNKNOWN = 'UNKNOWN',
}

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

export const UI_CONTROLS_LIST = [AdvancedFieldType.literal, AdvancedFieldType.simple, AdvancedFieldType.complex];

export const UI_DROPDOWNS_LIST = [AdvancedFieldType.dropdown, AdvancedFieldType.dropdownOption];
