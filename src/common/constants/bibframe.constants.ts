import { BFLITE_URIS } from './bibframeMapping.constants';

export const RESOURCE_TEMPLATE_IDS: Record<string, string> = {
  'lde:Profile:Work': 'Work',
  'lde:Profile:Instance': 'Instance',
  'lde:Profile:Hub': 'Hub',
};

export enum BibframeEntitiesMap {
  'http://bibfra.me/vocab/lite/Work' = 'work',
  'http://bibfra.me/vocab/lite/Instance' = 'instance',
  'http://bibfra.me/vocab/lite/Hub' = 'hub',
}

export const PROFILE_BFIDS = {
  WORK: 'lde:Profile:Work',
  INSTANCE: 'lde:Profile:Instance',
  HUB: 'lde:Profile:Hub',
};

export enum BibframeEntities {
  INSTANCE = 'INSTANCE',
  WORK = 'WORK',
  HUB = 'HUB',
}

export const TYPE_URIS = {
  INSTANCE: BFLITE_URIS.INSTANCE,
  WORK: BFLITE_URIS.WORK,
  HUB: BFLITE_URIS.HUB,
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
  BFLITE_URIS.TITLE_CONTAINER,
  BFLITE_URIS.LIBRARY_PARALLEL_TITLE,
  BFLITE_URIS.LIBRARY_VARIANT_TITLE,
];

export const LOOKUPS_WITH_SIMPLE_STRUCTURE = [BFLITE_URIS.ISSUANCE];

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

export const INSTANCE_CLONE_DELETE_PROPERTIES = [BFLITE_URIS.CREATED_DATE, BFLITE_URIS.CONTROL_NUMBER];

// Properties with values originating from FOLIO that may need
// a visual placeholder in the editor before those values have
// been recorded. Currently is an identical set to those properties that
// should be removed from cloned instances. Break the association
// if the sets start to differ.
export const PROPERTIES_FROM_FOLIO = INSTANCE_CLONE_DELETE_PROPERTIES;

export const WORK_TYPES = [
  { label: 'types.books', uri: BFLITE_URIS.BOOKS },
  { label: 'types.continuingResources', uri: BFLITE_URIS.CONTINUING_RESOURCES },
];
