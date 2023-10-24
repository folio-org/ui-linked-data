export const BF2_TO_BFLITE_MAP: BFLiteMap = {
  'http://id.loc.gov/ontologies/bibframe/Instance': 'http://bibfra.me/vocab/lite/Instance',
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
    'http://bibfra.me/vocab/marc/statementOfResponsibility',
  'http://id.loc.gov/ontologies/bibframe/editionStatement': 'http://bibfra.me/vocab/marc/edition',
  'http://id.loc.gov/ontologies/bibframe/provisionActivity': 'https://bibfra.me/vocab/marc/provisionActivity',
  'http://id.loc.gov/ontologies/bibframe/Publication': 'http://bibfra.me/vocab/marc/publication',
  'http://id.loc.gov/ontologies/bibframe/place': 'http://bibfra.me/vocab/lite/providerPlace',
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
  'http://www.w3.org/2000/01/rdf-schema#label': {
    'http://id.loc.gov/ontologies/bibframe/note': 'http://bibfra.me/vocab/lite/note',
    'http://id.loc.gov/ontologies/bibframe/electronicLocator': 'http://bibfra.me/vocab/lite/note',
  },
  'http://www.w3.org/1999/02/22-rdf-syntax-ns#value': {
    'http://id.loc.gov/ontologies/bibframe/Lccn': 'http://bibfra.me/vocab/lite/name',
    'http://id.loc.gov/ontologies/bibframe/Isbn': 'http://bibfra.me/vocab/lite/name',
    'http://id.loc.gov/ontologies/bibframe/Identifier': 'http://bibfra.me/vocab/lite/name',
    'http://id.loc.gov/ontologies/bibframe/Local': 'http://bibfra.me/vocab/marc/localId',
    'http://id.loc.gov/ontologies/bibframe/Ean': 'http://bibfra.me/vocab/marc/ean',
    'http://id.loc.gov/ontologies/bibframe/supplementaryContent': 'http://bibfra.me/vocab/marc/supplementaryContent',
    'http://id.loc.gov/ontologies/bibframe/electronicLocator': 'http://bibfra.me/vocab/lite/link',
  },
  'http://id.loc.gov/ontologies/bibframe/date': {
    'http://id.loc.gov/ontologies/bibframe/title': 'http://bibfra.me/vocab/lite/date',
    'http://id.loc.gov/ontologies/bibframe/provisionActivity': 'http://bibfra.me/vocab/lite/providerDate',
  },
};

export const BFLITE_URIS = {
  NAME: 'http://bibfra.me/vocab/lite/name',
  LABEL: 'http://bibfra.me/vocab/lite/label',
  LINK: 'http://bibfra.me/vocab/lite/link',
  CODE: 'http://bibfra.me/vocab/marc/code',
  TERM: 'http://bibfra.me/vocab/marc/term',
};

export const BFLITE_LABELS_MAP = {
  'http://bibfra.me/vocab/lite/providerPlace': BFLITE_URIS.NAME,
  'http://bibfra.me/vocab/marc/status': BFLITE_URIS.LABEL,
  'http://bibfra.me/vocab/marc/media': BFLITE_URIS.TERM,
  'http://bibfra.me/vocab/marc/carrier': BFLITE_URIS.TERM,
};

export const ADVANCED_FIELDS = {
  'http://bibfra.me/vocab/marc/copyright': {
    valueUri: 'http://bibfra.me/vocab/lite/date',
  },
};

export const BF_URIS = {
  LABEL: 'http://www.w3.org/2000/01/rdf-schema#label',
};
