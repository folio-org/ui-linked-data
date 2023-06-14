export const RESOURCE_TEMPLATE_IDS: Record<string, string> = {
  'lc:RT:bf2:Monograph:Work': 'Work',
  'lc:RT:bf2:Monograph:Instance': 'Instance'
}

export const PROFILE_NAMES = {
  MONOGRAPH: 'BIBFRAME 2.0 Monograph'
}

export enum FieldType {
  META = 'META',
  HIDE = 'HIDE',
  REF = 'REF',
  LITERAL = 'LITERAL',
  SIMPLE = 'SIMPLE',
  COMPLEX = 'COMPLEX',
  UNKNOWN = 'UNKNOWN'
}
