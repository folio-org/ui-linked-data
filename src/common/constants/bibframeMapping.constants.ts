export const BFLITE_URIS = {
  NAME: 'http://bibfra.me/vocab/lite/name',
  LABEL: 'http://bibfra.me/vocab/lite/label',
  LINK: 'http://bibfra.me/vocab/lite/link',
  CODE: 'http://bibfra.me/vocab/marc/code',
  TERM: 'http://bibfra.me/vocab/marc/term',
  SOURCE: 'http://bibfra.me/vocab/marc/source',
  EDITION: 'http://bibfra.me/vocab/marc/edition',
  EDITION_TYPE: 'http://bibfra.me/vocab/marc/editionType',
  TABLE_OF_CONTENTS: 'http://bibfra.me/vocab/marc/tableOfContents',
  SUMMARY: 'http://bibfra.me/vocab/marc/summary',
  INSTANTIATES: 'http://bibfra.me/vocab/lite/instantiates',
  EXTENT_TEMP: 'BFLITE_URI_TEMP_EXTENT', // TODO: set the value when the API contract for Extent field is updated
  EXTENT: 'http://bibfra.me/vocab/lite/extent',
  APPLIES_TO_TEMP: 'APPLIES_TO_TEMP',
  NOTE: 'http://bibfra.me/vocab/lite/note',
};

export const BF2_URIS = {
  NOTE: 'http://id.loc.gov/ontologies/bibframe/note',
};

// TODO: should be refactored.
// This is a temporary solution until the API contract for such fields becomes stable.
export const TEMP_URIS = {
  'http://id.loc.gov/ontologies/bibframe/Extent': BFLITE_URIS.EXTENT_TEMP,
};

// TODO: should be refactored.
// This is a temporary solution until the API contract for such fields becomes stable.
export const TEMP_BF2_TO_BFLITE_MAP = {
  [BFLITE_URIS.EXTENT_TEMP]: BFLITE_URIS.EXTENT,
};

export const BF2_TO_BFLITE_MAP: BFLiteMap = {
  'http://id.loc.gov/ontologies/bibframe/Instance': 'http://bibfra.me/vocab/lite/Instance',
  'http://id.loc.gov/ontologies/bibframe/Work': 'http://bibfra.me/vocab/lite/instantiates',
  'http://id.loc.gov/ontologies/bibframe/title': 'http://bibfra.me/vocab/marc/title',
  'http://id.loc.gov/ontologies/bibframe/Title': 'http://bibfra.me/vocab/marc/Title',
  'http://id.loc.gov/ontologies/bflc/nonSortNum': 'http://bibfra.me/vocab/bflc/nonSortNum',
  'http://id.loc.gov/ontologies/bibframe/mainTitle': 'http://bibfra.me/vocab/marc/mainTitle',
  'http://id.loc.gov/ontologies/bibframe/partNumber': 'http://bibfra.me/vocab/marc/partNumber',
  'http://id.loc.gov/ontologies/bibframe/partName': 'http://bibfra.me/vocab/marc/partName',
  'http://id.loc.gov/ontologies/bibframe/subtitle': 'http://bibfra.me/vocab/marc/subTitle',
  'http://id.loc.gov/ontologies/bibframe/VariantTitle': 'http://bibfra.me/vocab/marc/VariantTitle',
  'http://id.loc.gov/ontologies/bibframe/variantType': 'http://bibfra.me/vocab/marc/variantType',
  'http://id.loc.gov/ontologies/bibframe/ParallelTitle': 'http://bibfra.me/vocab/marc/ParallelTitle',
  'http://id.loc.gov/ontologies/bibframe/note': 'http://bibfra.me/vocab/lite/note',
  'http://id.loc.gov/ontologies/bibframe/responsibilityStatement':
    'http://bibfra.me/vocab/marc/responsibilityStatement',
  'http://id.loc.gov/ontologies/bibframe/editionStatement': 'http://bibfra.me/vocab/marc/edition',
  'http://id.loc.gov/ontologies/bibframe/provisionActivity': 'https://bibfra.me/vocab/marc/provisionActivity',
  'http://id.loc.gov/ontologies/bibframe/Publication': 'http://bibfra.me/vocab/marc/publication',
  'http://id.loc.gov/ontologies/bibframe/place': 'http://bibfra.me/vocab/lite/providerPlace',
  'http://id.loc.gov/ontologies/bibframe/content': 'http://bibfra.me/vocab/marc/content',
  'http://id.loc.gov/ontologies/bflc/simplePlace': 'http://bibfra.me/vocab/lite/place',
  'http://id.loc.gov/ontologies/bflc/simpleAgent': 'http://bibfra.me/vocab/lite/name',
  'http://id.loc.gov/ontologies/bflc/simpleDate': 'http://bibfra.me/vocab/lite/date',
  'http://id.loc.gov/ontologies/bibframe/Distribution': 'http://bibfra.me/vocab/marc/distribution',
  'http://id.loc.gov/ontologies/bibframe/Manufacture': 'http://bibfra.me/vocab/marc/manufacture',
  'http://id.loc.gov/ontologies/bibframe/Production': 'http://bibfra.me/vocab/marc/production',
  'http://id.loc.gov/ontologies/bibframe/identifiedBy': 'http://library.link/vocab/map',
  'http://id.loc.gov/ontologies/bibframe/Lccn': 'http://library.link/identifier/LCCN',
  'http://id.loc.gov/ontologies/bibframe/Isbn': 'http://library.link/identifier/ISBN',
  'http://id.loc.gov/ontologies/bibframe/Identifier': 'http://library.link/identifier/UNKNOWN', // TODO: update when defined
  'http://id.loc.gov/ontologies/bibframe/Local': 'http://bibfra.me/vocab/lite/LocalId',
  'http://id.loc.gov/ontologies/bibframe/assigner': 'http://bibfra.me/vocab/marc/localIdAssigningSource',
  'http://id.loc.gov/ontologies/bibframe/Ean': 'http://bibfra.me/vocab/identifier/Ean',
  'http://id.loc.gov/ontologies/bibframe/qualifier': 'http://bibfra.me/vocab/marc/qualifier',
  'http://id.loc.gov/ontologies/bibframe/electronicLocator': 'http://bibfra.me/vocab/marc/accessLocation',
  'http://id.loc.gov/ontologies/bibframe/media': 'http://bibfra.me/vocab/marc/media',
  'http://id.loc.gov/ontologies/bibframe/carrier': 'http://bibfra.me/vocab/marc/carrier',
  'http://id.loc.gov/ontologies/bibframe/dimensions': 'http://bibfra.me/vocab/marc/dimensions',
  'http://id.loc.gov/ontologies/bflc/projectedProvisionDate': 'http://bibfra.me/vocab/bflc/projectedProvisionDate',
  'http://id.loc.gov/ontologies/bibframe/copyrightDate': 'http://bibfra.me/vocab/marc/copyright',
  'http://id.loc.gov/ontologies/bibframe/issuance': 'http://bibfra.me/vocab/marc/issuance',
  'http://id.loc.gov/ontologies/bibframe/status': 'http://bibfra.me/vocab/marc/status',
  'http://id.loc.gov/ontologies/bibframe/classification': 'http://bibfra.me/vocab/lite/classification',
  'http://id.loc.gov/ontologies/bibframe/classificationPortion': BFLITE_URIS.CODE,
  'http://id.loc.gov/ontologies/bibframe/itemPortion': 'http://bibfra.me/vocab/marc/itemNumber',
  'http://id.loc.gov/ontologies/bibframe/source': BFLITE_URIS.EDITION,
  'http://id.loc.gov/ontologies/bibframe/edition': BFLITE_URIS.EDITION_TYPE,
  'http://id.loc.gov/ontologies/bibframe/Person': 'http://bibfra.me/vocab/lite/Person',
  'http://id.loc.gov/ontologies/bibframe/Family': 'http://bibfra.me/vocab/lite/Family',
  'http://id.loc.gov/ontologies/bibframe/Organization': 'http://bibfra.me/vocab/lite/Organization',
  'http://id.loc.gov/ontologies/bibframe/Meeting': 'http://bibfra.me/vocab/lite/Meeting',
  'http://id.loc.gov/ontologies/bibframe/summary': BFLITE_URIS.SUMMARY,
  'http://id.loc.gov/ontologies/bibframe/language': 'http://bibfra.me/vocab/lite/language',
  'http://id.loc.gov/ontologies/bibframe/Contribution': 'http://bibfra.me/vocab/lite/contributor',
  'http://id.loc.gov/ontologies/bflc/PrimaryContribution': 'http://bibfra.me/vocab/lite/creator',
  'http://id.loc.gov/ontologies/bibframe/extent': '', // TODO: set the value when the API contract for the Extent field is updated
  'http://id.loc.gov/ontologies/bibframe/Extent': BFLITE_URIS.EXTENT_TEMP,
  'http://id.loc.gov/ontologies/bibframe/supplementaryContent': {
    'http://id.loc.gov/ontologies/bibframe/Instance': 'http://bibfra.me/vocab/marc/supplementaryContent',
  },
  'http://www.w3.org/2000/01/rdf-schema#label': {
    'http://id.loc.gov/ontologies/bibframe/note': 'http://bibfra.me/vocab/lite/note',
    'http://id.loc.gov/ontologies/bibframe/electronicLocator': 'http://bibfra.me/vocab/lite/note',
    'http://id.loc.gov/ontologies/bibframe/summary': BFLITE_URIS.SUMMARY,
    'http://id.loc.gov/ontologies/bibframe/TableOfContents': BFLITE_URIS.TABLE_OF_CONTENTS,
    'http://id.loc.gov/ontologies/bibframe/extent': BFLITE_URIS.EXTENT,
    'http://id.loc.gov/ontologies/bflc/AppliesTo': BFLITE_URIS.APPLIES_TO_TEMP, // TODO: set the value when the API contract for the Extent field is updated
    'http://id.loc.gov/ontologies/bibframe/supplementaryContent': 'http://bibfra.me/vocab/lite/name',
  },
  'http://www.w3.org/1999/02/22-rdf-syntax-ns#value': {
    'http://id.loc.gov/ontologies/bibframe/Lccn': 'http://bibfra.me/vocab/lite/name',
    'http://id.loc.gov/ontologies/bibframe/Isbn': 'http://bibfra.me/vocab/lite/name',
    'http://id.loc.gov/ontologies/bibframe/Identifier': 'http://bibfra.me/vocab/lite/name',
    'http://id.loc.gov/ontologies/bibframe/Local': 'http://bibfra.me/vocab/marc/localId',
    'http://id.loc.gov/ontologies/bibframe/Ean': 'http://bibfra.me/vocab/marc/ean',
    'http://id.loc.gov/ontologies/bibframe/supplementaryContent': 'http://bibfra.me/vocab/lite/link',
    'http://id.loc.gov/ontologies/bibframe/electronicLocator': 'http://bibfra.me/vocab/lite/link',
  },
  'http://id.loc.gov/ontologies/bibframe/date': {
    'http://id.loc.gov/ontologies/bibframe/title': 'http://bibfra.me/vocab/lite/date',
    'http://id.loc.gov/ontologies/bibframe/provisionActivity': 'http://bibfra.me/vocab/lite/providerDate',
  },
  'http://www.w3.org/2002/07/owl#sameAs': {
    'http://id.loc.gov/ontologies/bibframe/language': 'http://bibfra.me/vocab/lite/language',
    'http://id.loc.gov/ontologies/bibframe/Person': BFLITE_URIS.NAME,
    'http://id.loc.gov/ontologies/bibframe/Family': BFLITE_URIS.NAME,
    'http://id.loc.gov/ontologies/bibframe/Organization': BFLITE_URIS.NAME,
    'http://id.loc.gov/ontologies/bibframe/Meeting': BFLITE_URIS.NAME,
  },
};

export const NON_BF_RECORD_ELEMENTS = {
  [BFLITE_URIS.NOTE]: { container: '_notes' },
};

export const NON_BF_GROUP_TYPE = {
  [BF2_URIS.NOTE]: {
    container: { key: NON_BF_RECORD_ELEMENTS[BFLITE_URIS.NOTE].container },
    'http://www.w3.org/2000/01/rdf-schema#label': { key: 'value' },
    'http://www.w3.org/1999/02/22-rdf-syntax-ns#type': { key: 'type' },
    'http://id.loc.gov/ontologies/bibframe/noteType': { key: 'type' },
  },
};

export const BFLITE_LABELS_MAP = {
  'http://bibfra.me/vocab/lite/providerPlace': BFLITE_URIS.LABEL,
  'http://bibfra.me/vocab/marc/status': BFLITE_URIS.LABEL,
  'http://bibfra.me/vocab/marc/media': BFLITE_URIS.TERM,
  'http://bibfra.me/vocab/marc/carrier': BFLITE_URIS.TERM,
  'http://bibfra.me/vocab/marc/content': BFLITE_URIS.CODE, // code/link? NAME?
  'http://bibfra.me/vocab/lite/classification': BFLITE_URIS.SOURCE,
  'http://bibfra.me/vocab/lite/Person': BFLITE_URIS.NAME,
  'http://bibfra.me/vocab/lite/Family': BFLITE_URIS.NAME,
  'http://bibfra.me/vocab/lite/Organization': BFLITE_URIS.NAME,
  'http://bibfra.me/vocab/lite/Meeting': BFLITE_URIS.NAME,
};

export const ADVANCED_FIELDS = {
  'http://bibfra.me/vocab/marc/copyright': {
    valueUri: 'http://bibfra.me/vocab/lite/date',
  },
};

export const BF_URIS = {
  LABEL: 'http://www.w3.org/2000/01/rdf-schema#label',
};

export const BLOCK_URIS_BFLITE = {
  INSTANCE: 'http://bibfra.me/vocab/lite/Instance',
  WORK: 'http://bibfra.me/vocab/lite/instantiates',
};

export const TYPE_MAP = {
  [BF2_URIS.NOTE]: {
    field: {
      uri: 'http://id.loc.gov/ontologies/bibframe/noteType',
    },
    data: {
      [BFLITE_URIS.NOTE]: {
        uri: BF2_URIS.NOTE,
      },
      'http://bibfra.me/vocab/marc/withNote': {
        uri: 'http://id.loc.gov/vocabulary/mnotetype/with',
        parentBlock: { bfLiteUri: BLOCK_URIS_BFLITE.INSTANCE },
      },
      'http://bibfra.me/vocab/marc/typeOfReport': {
        uri: 'http://id.loc.gov/vocabulary/mnotetype/report',
        parentBlock: { bfLiteUri: BLOCK_URIS_BFLITE.INSTANCE },
      },
      'http://bibfra.me/vocab/marc/issuanceNote': {
        uri: 'http://id.loc.gov/vocabulary/mnotetype/issuance',
        parentBlock: { bfLiteUri: BLOCK_URIS_BFLITE.INSTANCE },
      },
      'http://bibfra.me/vocab/marc/computerDataNote': {
        uri: 'http://id.loc.gov/vocabulary/mnotetype/computer',
        parentBlock: { bfLiteUri: BLOCK_URIS_BFLITE.INSTANCE },
      },
      'http://bibfra.me/vocab/marc/additionalPhysicalForm': {
        uri: 'http://id.loc.gov/vocabulary/mnotetype/addphys',
        parentBlock: { bfLiteUri: BLOCK_URIS_BFLITE.INSTANCE },
      },
      'http://bibfra.me/vocab/marc/reproductionNote': {
        uri: 'http://id.loc.gov/vocabulary/mnotetype/repro',
        parentBlock: { bfLiteUri: BLOCK_URIS_BFLITE.INSTANCE },
      },
      'http://bibfra.me/vocab/marc/originalVersionNote': {
        uri: 'http://id.loc.gov/vocabulary/mnotetype/orig',
        parentBlock: { bfLiteUri: BLOCK_URIS_BFLITE.INSTANCE },
      },
      'http://bibfra.me/vocab/marc/fundingInformation': {
        uri: 'http://id.loc.gov/vocabulary/mnotetype/fundinfo',
        parentBlock: { bfLiteUri: BLOCK_URIS_BFLITE.INSTANCE },
      },
      'http://bibfra.me/vocab/marc/relatedParts': {
        uri: 'http://id.loc.gov/vocabulary/mnotetype/related',
        parentBlock: { bfLiteUri: BLOCK_URIS_BFLITE.INSTANCE },
      },
      'http://bibfra.me/vocab/marc/issuingBody': {
        uri: 'http://id.loc.gov/vocabulary/mnotetype/issuing',
        parentBlock: { bfLiteUri: BLOCK_URIS_BFLITE.INSTANCE },
      },
      'http://bibfra.me/vocab/marc/locationOfOtherArchivalMaterial': {
        uri: 'http://id.loc.gov/vocabulary/mnotetype/finding',
        parentBlock: { bfLiteUri: BLOCK_URIS_BFLITE.INSTANCE },
      },
      'http://bibfra.me/vocab/marc/exhibitionsNote': {
        uri: 'http://id.loc.gov/vocabulary/mnotetype/exhibit',
        parentBlock: { bfLiteUri: BLOCK_URIS_BFLITE.INSTANCE },
      },
      'http://bibfra.me/vocab/marc/descriptionSourceNote': {
        uri: 'https://id.loc.gov/vocabulary/mnotetype/descsource',
        parentBlock: { bfLiteUri: BLOCK_URIS_BFLITE.INSTANCE },
      },
      'http://bibfra.me/vocab/marc/bibliographyNote': {
        uri: 'http://id.loc.gov/vocabulary/mnotetype/biblio',
        parentBlock: { bfLiteUri: BLOCK_URIS_BFLITE.WORK },
      },
      'http://bibfra.me/vocab/marc/languageNote': {
        uri: 'http://id.loc.gov/vocabulary/mnotetype/lang',
        parentBlock: { bfLiteUri: BLOCK_URIS_BFLITE.WORK },
      },
    },
  },
};

export const NEW_BF2_TO_BFLITE_MAPPING = {
  'http://bibfra.me/vocab/marc/title': {
    container: { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/title' },
    options: {
      'http://bibfra.me/vocab/marc/Title': { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/Title' },
      'http://bibfra.me/vocab/marc/VariantTitle': { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/VariantTitle' },
      'http://bibfra.me/vocab/marc/ParallelTitle': { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/ParallelTitle' },
    },
    fields: {
      'http://bibfra.me/vocab/bflc/nonSortNum': { bf2Uri: 'http://id.loc.gov/ontologies/bflc/nonSortNum' },
      'http://bibfra.me/vocab/marc/mainTitle': { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/mainTitle' },
      'http://bibfra.me/vocab/marc/partNumber': { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/partNumber' },
      'http://bibfra.me/vocab/marc/partName': { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/partName' },
      'http://bibfra.me/vocab/marc/subTitle': { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/subtitle' },
      'http://bibfra.me/vocab/marc/variantType': { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/variantType' },
      'http://bibfra.me/vocab/lite/note': { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/note' },
    },
  },
  'http://bibfra.me/vocab/marc/edition': {
    container: { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/editionStatement' },
  },
  'http://bibfra.me/vocab/marc/production': {
    container: { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/provisionActivity' },
    options: {
      'http://bibfra.me/vocab/marc/production': { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/Production' },
    },
    fields: {
      'http://bibfra.me/vocab/lite/providerDate': { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/date' },
      'http://bibfra.me/vocab/lite/place': { bf2Uri: 'http://id.loc.gov/ontologies/bflc/simplePlace' },
      'http://bibfra.me/vocab/lite/name': { bf2Uri: 'http://id.loc.gov/ontologies/bflc/simpleAgent' },
      'http://bibfra.me/vocab/lite/date': { bf2Uri: 'http://id.loc.gov/ontologies/bflc/simpleDate' },
    },
  },
  'https://bibfra.me/vocab/marc/provisionActivity': {
    container: { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/provisionActivity' },
    options: {
      'http://bibfra.me/vocab/marc/production': { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/Production' },
      'http://bibfra.me/vocab/marc/publication': { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/Publication' },
      'http://bibfra.me/vocab/marc/distribution': { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/Distribution' },
      'http://bibfra.me/vocab/marc/manufacture': { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/Manufacture' },
    },
    fields: {
      'http://bibfra.me/vocab/lite/providerDate': { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/date' },
      'http://bibfra.me/vocab/lite/providerPlace': { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/place' },
      'http://bibfra.me/vocab/lite/place': { bf2Uri: 'http://id.loc.gov/ontologies/bflc/simplePlace' },
      'http://bibfra.me/vocab/lite/name': { bf2Uri: 'http://id.loc.gov/ontologies/bflc/simpleAgent' },
      'http://bibfra.me/vocab/lite/date': { bf2Uri: 'http://id.loc.gov/ontologies/bflc/simpleDate' },
    },
  },
  'http://library.link/vocab/map': {
    container: { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/identifiedBy' },
    options: {
      'http://library.link/identifier/LCCN': { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/Lccn' },
      'http://library.link/identifier/ISBN': { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/Isbn' },
      'http://library.link/identifier/UNKNOWN': { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/Identifier' },
      'http://bibfra.me/vocab/lite/LocalId': { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/Local' },
      'http://bibfra.me/vocab/identifier/Ean': { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/Ean' },
    },
    fields: {
      'http://bibfra.me/vocab/lite/name': { bf2Uri: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#value' },
      'http://bibfra.me/vocab/marc/status': { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/status' },
      'http://bibfra.me/vocab/marc/qualifier': { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/qualifier' },
      'http://bibfra.me/vocab/marc/localId': { bf2Uri: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#value' },
      'http://bibfra.me/vocab/marc/localIdAssigningSource': {
        bf2Uri: 'http://id.loc.gov/ontologies/bibframe/assigner',
      },
      'http://bibfra.me/vocab/marc/ean': { bf2Uri: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#value' },
    },
  },
  'http://bibfra.me/vocab/marc/issuance': {
    container: { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/issuance' },
  },
  [NON_BF_RECORD_ELEMENTS[BFLITE_URIS.NOTE].container]: {
    container: { bf2Uri: BF2_URIS.NOTE },
    fields: {
      value: { bf2Uri: 'http://www.w3.org/2000/01/rdf-schema#label' },
      type: { bf2Uri: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' },
    },
  },
  'http://bibfra.me/vocab/marc/dimensions': {
    container: { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/dimensions' },
  },
  'http://bibfra.me/vocab/marc/accessLocation': {
    container: { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/electronicLocator' },
    fields: {
      'http://bibfra.me/vocab/lite/link': { bf2Uri: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#value' },
      'http://bibfra.me/vocab/lite/note': { bf2Uri: 'http://www.w3.org/2000/01/rdf-schema#label' },
    },
  },
  'http://bibfra.me/vocab/marc/media': {
    container: { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/media' },
  },
  'http://bibfra.me/vocab/lite/extent': {
    container: { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/extent' },
    fields: {
      'http://bibfra.me/vocab/lite/extent': { bf2Uri: 'http://www.w3.org/2000/01/rdf-schema#label' },
    },
  },
};
