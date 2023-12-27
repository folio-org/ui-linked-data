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

export const GROUPS_WITHOUT_ROOT_WRAPPER = [
  'http://id.loc.gov/ontologies/bibframe/provisionActivity',
  'http://id.loc.gov/ontologies/bibframe/summary',
  'http://id.loc.gov/ontologies/bibframe/language',
  'http://id.loc.gov/ontologies/bibframe/tableOfContents',
];

export const LOOKUPS_WITH_SIMPLE_STRUCTURE = [
  'http://bibfra.me/vocab/marc/issuance',
  'http://bibfra.me/vocab/lite/language',
];

export const COMPLEX_GROUPS = [
  'http://id.loc.gov/ontologies/bibframe/electronicLocator',
  'http://id.loc.gov/ontologies/bibframe/supplementaryContent',
];

export const HIDDEN_WRAPPERS = ['http://www.w3.org/2000/01/rdf-schema#label'];

// potentially can be merged with the above ? not sure
export const FORCE_EXCLUDE_WHEN_DEPARSING = [
  'http://id.loc.gov/ontologies/bibframe/Summary',
  'http://id.loc.gov/ontologies/bibframe/Language',
  'http://id.loc.gov/ontologies/bibframe/TableOfContents',
  'http://id.loc.gov/ontologies/bibframe/agent',
];

export const COMPLEX_GROUPS_WITHOUT_WRAPPER = [
  'http://id.loc.gov/ontologies/bibframe/note',
  'http://id.loc.gov/ontologies/bibframe/extent', // TODO: refactor when the API contract for the Extent field is updated
];

// TODO: remove when the API contract for Extent and similar fields is updated
export const TEMPORARY_URIS_WITHOUT_MAPPING = [BFLITE_URIS.EXTENT_TEMP];

// TODO: remove when the API contract for Extent and similar fields is updated
export const TEMPORARY_COMPLEX_GROUPS = ['http://id.loc.gov/ontologies/bibframe/extent'];

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
};

export const INSTANTIATES_TO_INSTANCE_FIELDS = ['http://bibfra.me/vocab/marc/responsibilityStatement'];

export const NOTE_TYPES = [
  'http://bibfra.me/vocab/lite/note',
  'http://bibfra.me/vocab/marc/withNote',
  'http://bibfra.me/vocab/marc/governingAccessNote',
  'http://bibfra.me/vocab/marc/creditsNote',
  'http://bibfra.me/vocab/marc/participantNote',
  'http://bibfra.me/vocab/marc/typeOfReport',
  'http://bibfra.me/vocab/marc/issuanceNote',
  'http://bibfra.me/vocab/marc/computerDataNote',
  'http://bibfra.me/vocab/marc/citationCoverage',
  'http://bibfra.me/vocab/marc/additionalPhysicalForm',
  'http://bibfra.me/vocab/marc/accessibilityNote',
  'http://bibfra.me/vocab/marc/reproductionNote',
  'http://bibfra.me/vocab/marc/originalVersionNote',
  'http://bibfra.me/vocab/marc/locationOfOriginalsDuplicates',
  'http://bibfra.me/vocab/marc/fundingInformation',
  'http://bibfra.me/vocab/marc/informationRelatingToCopyrightStatus',
  'http://bibfra.me/vocab/marc/relatedParts',
  'http://bibfra.me/vocab/marc/formerTitleNote',
  'http://bibfra.me/vocab/marc/issuingBody',
  'http://bibfra.me/vocab/marc/entityAndAttributeInformation',
  'http://bibfra.me/vocab/marc/locationOfOtherArchivalMaterial',
  'http://bibfra.me/vocab/marc/informationAboutDocumentation',
  'http://bibfra.me/vocab/marc/additionalPhysicalForm',
  'http://bibfra.me/vocab/marc/exhibitionsNote',
  'http://bibfra.me/vocab/marc/descriptionSourceNote',
  'http://bibfra.me/vocab/marc/systemDetails',
  'http://bibfra.me/vocab/marc/systemDetailsAccessNote',
  'http://bibfra.me/vocab/marc/physicalDescription',
  'http://bibfra.me/vocab/marc/publicationFrequency',
  'http://bibfra.me/vocab/marc/datesOfPublicationNote',
  'http://bibfra.me/vocab/marc/bibliographyNote',
  'http://bibfra.me/vocab/marc/scaleNote',
  'http://bibfra.me/vocab/marc/references',
  'http://bibfra.me/vocab/marc/dataQuality',
  'http://bibfra.me/vocab/marc/otherEventInformation',
  'http://bibfra.me/vocab/marc/geographicCoverage',
  'http://bibfra.me/vocab/marc/supplement',
  'http://bibfra.me/vocab/marc/studyProgramName',
  'http://bibfra.me/vocab/marc/languageNote',
  'http://bibfra.me/vocab/marc/formerTitleComplexityNote',
];
