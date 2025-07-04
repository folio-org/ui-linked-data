export const RESOURCE_TEMPLATE_IDS: Record<string, string> = {
  'lc:RT:bf2:Monograph:Work': 'Work',
  'lc:RT:bf2:Monograph:Instance': 'Instance',
};

export enum BibframeEntitiesMap {
  'http://bibfra.me/vocab/lite/Work' = 'work',
  'http://bibfra.me/vocab/lite/Instance' = 'instance',
}

export const PROFILE_BFIDS = {
  MONOGRAPH: 'lc:profile:bf2:Monograph',
  WORK: 'lc:RT:bf2:Monograph:Work',
  INSTANCE: 'lc:RT:bf2:Monograph:Instance',
};

export enum BibframeEntities {
  INSTANCE = 'INSTANCE',
  WORK = 'WORK',
}

export const TYPE_URIS = {
  INSTANCE: 'http://bibfra.me/vocab/lite/Instance',
  WORK: 'http://bibfra.me/vocab/lite/Work',
};

export const CONSTRAINTS: Constraints = {
  repeatable: false,
  editable: true,
  mandatory: false,
  defaults: [],
  useValuesFrom: [],
  valueDataType: {
    dataTypeURI: '',
  },
};

export const GROUP_BY_LEVEL = 2;
export const GROUP_CONTENTS_LEVEL = GROUP_BY_LEVEL + 1;
export const GROUP_COMPLEX_CUTOFF_LEVEL = 4;

// Work, Instance, Item
export const ENTITY_LEVEL = 1;

export const TITLE_CONTAINER_URIS = [
  'http://bibfra.me/vocab/marc/Title',
  'http://bibfra.me/vocab/marc/ParralelTitle',
  'http://bibfra.me/vocab/marc/VariantTitle',
];

export const LOOKUPS_WITH_SIMPLE_STRUCTURE = ['http://bibfra.me/vocab/marc/issuance'];

export const LOC_GOV_URI = 'http://id.loc.gov/';

export const PREV_ENTRY_PATH_INDEX = 2;
export const MIN_AMT_OF_SIBLING_ENTRIES_TO_BE_DELETABLE = 2;
export const GRANDPARENT_ENTRY_PATH_INDEX = PREV_ENTRY_PATH_INDEX + 1;

export const BFID_DELIMITER = ':';
export const EXTRA_BFID_DELIMITER = '$$';
export const BF_URI_DELIMITER = '/';
export const ENTRY_DELIMITER = '__';
export const ENTRY_COUNT_DELIMITER = '::';
export const ENTRY_CONTROL_DELIMITER = '--';
export const TWIN_CHILDREN_KEY_DELIMITER = '$$';
export const PROFILE_NODE_ID_DELIMITER = ':';
