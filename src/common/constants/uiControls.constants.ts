import { CUSTOM_PROFILE_ENABLED } from './feature.constants';

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

export enum SchemaControlType {
  Duplicate = 'addDuplicate',
  RemoveDuplicate = 'removeDuplicate',
  ChangeComplexFieldValue = 'changeComplexFieldValue',
}

const BASE_UI_CONTROLS_LIST = [AdvancedFieldType.literal, AdvancedFieldType.simple, AdvancedFieldType.complex];

export const UI_CONTROLS_LIST = CUSTOM_PROFILE_ENABLED
  ? [...BASE_UI_CONTROLS_LIST, AdvancedFieldType.dropdown]
  : BASE_UI_CONTROLS_LIST;

export const UI_DROPDOWNS_LIST = [AdvancedFieldType.dropdown, AdvancedFieldType.dropdownOption];

export const NOT_PREVIEWABLE_TYPES = [
  AdvancedFieldType.profile,
  AdvancedFieldType.block,
  AdvancedFieldType.hidden,
  AdvancedFieldType.dropdownOption,
  AdvancedFieldType.complex,
];
