import { BFLITE_URIS } from './bibframeMapping.constants';

export const RESOURCE_TEMPLATE_IDS: Record<string, string> = {
  // TODO: revise after demo
  'lc:RT:bf2:Monograph:Work': 'Work',
  'lc:RT:bf2:Monograph:Instance': 'Instance',
};

export const PROFILE_NAMES = {
  MONOGRAPH: 'BIBFRAME 2.0 Monograph',
};

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

export const GROUPS_WITHOUT_ROOT_WRAPPER = [
  'http://id.loc.gov/ontologies/bibframe/provisionActivity',
  'http://id.loc.gov/ontologies/bibframe/summary',
  'http://id.loc.gov/ontologies/bibframe/tableOfContents',
];

export const LOOKUPS_WITH_SIMPLE_STRUCTURE = ['http://bibfra.me/vocab/marc/issuance'];

export const COMPLEX_GROUPS = [
  'http://id.loc.gov/ontologies/bibframe/electronicLocator',
  'http://id.loc.gov/ontologies/bibframe/supplementaryContent',
];

// potentially can be merged with the above ? not sure
export const FORCE_EXCLUDE_WHEN_DEPARSING = [
  'http://id.loc.gov/ontologies/bibframe/Summary',
  'http://id.loc.gov/ontologies/bibframe/Language',
  'http://id.loc.gov/ontologies/bibframe/TableOfContents',
  'http://id.loc.gov/ontologies/bibframe/agent',
  'http://www.loc.gov/mads/rdf/v1#Topic',
];

export const KEEP_VALUE_AS_IS = ['http://bibfra.me/vocab/lite/subject'];

export const OUTGOING_RECORD_IDENTIFIERS_TO_SWAP: Record<string, string> = {
  'http://www.loc.gov/mads/rdf/v1#Topic': 'http://bibfra.me/vocab/lite/subject',
};

export const IGNORE_HIDDEN_PARENT_OR_RECORD_SELECTION = ['http://id.loc.gov/ontologies/bibframe/agent'];

export const DUPLICATE_URI_REPLACEMENTS: Record<string, Record<string, string>> = {
  'http://id.loc.gov/ontologies/bibframe/contribution': {
    'http://id.loc.gov/ontologies/bibframe/Contribution': 'http://bibfra.me/vocab/lite/contributor',
    'http://id.loc.gov/ontologies/bflc/PrimaryContribution': 'http://bibfra.me/vocab/lite/creator',
  },
};

export const FORCE_INCLUDE_WHEN_DEPARSING = [
  'http://bibfra.me/vocab/lite/contributor',
  'http://bibfra.me/vocab/lite/creator',
];

export const NONARRAY_DROPDOWN_OPTIONS = [
  'http://bibfra.me/vocab/lite/Person',
  'http://bibfra.me/vocab/lite/Family',
  'http://bibfra.me/vocab/lite/Organization',
  'http://bibfra.me/vocab/lite/Meeting',
];

export const IDENTIFIER_AS_VALUE: Record<string, { field: string; value: string }> = {
  'http://id.loc.gov/ontologies/bibframe/ClassificationDdc': {
    field: BFLITE_URIS.SOURCE,
    value: 'ddc',
  },
  'http://id.loc.gov/ontologies/bibframe/ClassificationLcc': {
    field: BFLITE_URIS.SOURCE,
    value: 'lc',
  },
};

export const LOC_GOV_URI = 'http://id.loc.gov/';

export const PREV_ENTRY_PATH_INDEX = 2;
export const MIN_AMT_OF_SIBLING_ENTRIES_TO_BE_DELETABLE = 2;
export const GRANDPARENT_ENTRY_PATH_INDEX = PREV_ENTRY_PATH_INDEX + 1;

export const PROVISION_ACTIVITY_OPTIONS = [
  'http://bibfra.me/vocab/marc/production',
  'http://bibfra.me/vocab/marc/publication',
  'http://bibfra.me/vocab/marc/distribution',
  'http://bibfra.me/vocab/marc/manufacture',
];

export const BF2_PROPERTY_URIS = {
  HAS_INSTANCE: 'http://id.loc.gov/ontologies/bibframe/hasInstance',
  INSTANCE_OF: 'http://id.loc.gov/ontologies/bibframe/instanceOf',
  HAS_ITEM: 'http://id.loc.gov/ontologies/bibframe/hasItem',
};

export const BFID_DELIMITER = ':';
export const BF_URI_DELIMITER = '/';
export const ENTRY_DELIMITER = '__';
export const ENTRY_COUNT_DELIMITER = '::';
export const ENTRY_CONTROL_DELIMITER = '--';
