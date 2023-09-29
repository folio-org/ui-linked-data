export const RESOURCE_TEMPLATE_IDS: Record<string, string> = {
  // TODO: revise after demo
  // 'lc:RT:bf2:Monograph:Work': 'Work',
  'lc:RT:bf2:Monograph:Instance': 'Instance',
};

export const PROFILE_NAMES = {
  MONOGRAPH: 'BIBFRAME 2.0 Monograph',
};

export const PROFILE_IDS = {
  MONOGRAPH: 'lc:profile:bf2:Monograph',
};

export const TYPE_URIS = {
  INSTANCE: 'http://bibfra.me/vocab/lite/Instance',
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

export const GROUPS_WITHOUT_ROOT_WRAPPER = ['http://id.loc.gov/ontologies/bibframe/provisionActivity'];

export const LOOKUPS_WITH_SIMPLE_STRUCTURE = ['http://bibfra.me/vocab/marc/issuance'];

export const COMPLEX_GROUPS = ['http://id.loc.gov/ontologies/bibframe/electronicLocator'];

export const HIDDEN_WRAPPERS = ['http://www.w3.org/2000/01/rdf-schema#label'];

export const COMPLEX_GROUPS_WITHOUT_WRAPPER = ['http://id.loc.gov/ontologies/bibframe/note'];
