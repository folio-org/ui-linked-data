import { ResourceType } from './record.constants';

export const BFLITE_URIS = {
  INSTANCE: 'http://bibfra.me/vocab/lite/Instance',
  WORK: 'http://bibfra.me/vocab/lite/Work',
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
  CREATOR: 'http://bibfra.me/vocab/lite/creator',
  CONTRIBUTOR: 'http://bibfra.me/vocab/lite/contributor',
  PROVIDER_PLACE: 'http://bibfra.me/vocab/lite/providerPlace',
  CLASSIFICATION: 'http://bibfra.me/vocab/lite/classification',
  PROVISION_ACTIVITY: 'https://bibfra.me/vocab/marc/provisionActivity',
};

export const BF2_URIS = {
  NOTE: 'http://id.loc.gov/ontologies/bibframe/note',
  NOTE_TYPE: 'http://id.loc.gov/ontologies/bibframe/noteType',
  CONTRIBUTION: 'http://id.loc.gov/ontologies/bibframe/contribution',
};

// TODO: should be refactored.
// This is a temporary solution until the API contract for such fields becomes stable.
export const TEMP_URIS = {
  'http://id.loc.gov/ontologies/bibframe/Extent': BFLITE_URIS.EXTENT_TEMP,
};

export const BF2_TO_BFLITE_MAP: BFLiteMap = {
  'http://id.loc.gov/ontologies/bibframe/Instance': BFLITE_URIS.INSTANCE,
  'http://id.loc.gov/ontologies/bibframe/Work': BFLITE_URIS.WORK,
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
  'http://id.loc.gov/ontologies/bibframe/ClassificationDdc': 'ddc',
  'http://id.loc.gov/ontologies/bibframe/ClassificationLcc': 'lc',
  'http://id.loc.gov/ontologies/bibframe/classificationPortion': BFLITE_URIS.CODE,
  'http://id.loc.gov/ontologies/bibframe/itemPortion': 'http://bibfra.me/vocab/marc/itemNumber',
  'http://id.loc.gov/ontologies/bibframe/source': BFLITE_URIS.EDITION,
  'http://id.loc.gov/ontologies/bibframe/subject': 'http://bibfra.me/vocab/lite/subject',
  'http://id.loc.gov/ontologies/bibframe/edition': BFLITE_URIS.EDITION,
  'http://id.loc.gov/ontologies/bibframe/code': 'http://bibfra.me/vocab/marc/editionNumber',
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
  'http://id.loc.gov/ontologies/bibframe/assigner': {
    'http://id.loc.gov/ontologies/bibframe/classification': '_assigningSourceReference',
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
    'http://id.loc.gov/ontologies/bibframe/geographicCoverage': '_geographicCoverageReference',
  },
  'http://id.loc.gov/ontologies/bflc/governmentPubType': 'http://bibfra.me/vocab/marc/governmentPublication',
  'http://id.loc.gov/ontologies/bibframe/originDate': 'http://bibfra.me/vocab/lite/dateStart',
  'http://id.loc.gov/ontologies/bibframe/originPlace': 'http://bibfra.me/vocab/marc/originPlace',
  'http://id.loc.gov/ontologies/bibframe/intendedAudience': 'http://bibfra.me/vocab/marc/targetAudience',
};

export const NON_BF_RECORD_ELEMENTS = {
  [BFLITE_URIS.NOTE]: { container: '_notes' },
  [BFLITE_URIS.CONTRIBUTOR]: { container: 'roles' },
  [BFLITE_URIS.CREATOR]: { container: 'roles' },
};

export const NON_BF_RECORD_CONTAINERS = {
  [BFLITE_URIS.CREATOR]: { container: '_creatorReference' },
  [BFLITE_URIS.CONTRIBUTOR]: { container: '_contributorReference' },
};

export const NON_BF_GROUP_TYPE = {
  [BF2_URIS.NOTE]: {
    container: { key: NON_BF_RECORD_ELEMENTS[BFLITE_URIS.NOTE].container },
    'http://www.w3.org/2000/01/rdf-schema#label': { key: 'value' },
    'http://www.w3.org/1999/02/22-rdf-syntax-ns#type': { key: 'type' },
    'http://id.loc.gov/ontologies/bibframe/noteType': { key: 'type' },
  },
  [BF2_URIS.CONTRIBUTION]: {
    container: {
      altKeys: {
        'http://id.loc.gov/ontologies/bflc/PrimaryContribution': BFLITE_URIS.CREATOR,
        'http://id.loc.gov/ontologies/bibframe/Contribution': BFLITE_URIS.CONTRIBUTOR,
      },
    },
    options: {
      'http://id.loc.gov/ontologies/bibframe/Person': { key: 'http://bibfra.me/vocab/lite/Person' },
      'http://id.loc.gov/ontologies/bibframe/Family': { key: 'http://bibfra.me/vocab/lite/Family' },
      'http://id.loc.gov/ontologies/bibframe/Organization': { key: 'http://bibfra.me/vocab/lite/Organization' },
      'http://id.loc.gov/ontologies/bibframe/Meeting': { key: 'http://bibfra.me/vocab/lite/Meeting' },
    },
    'http://id.loc.gov/ontologies/bibframe/role': { key: NON_BF_RECORD_ELEMENTS[BFLITE_URIS.CONTRIBUTOR].container },
  },
};

export const BFLITE_LABELS_MAP = {
  'http://bibfra.me/vocab/lite/providerPlace': BFLITE_URIS.LABEL,
  'http://bibfra.me/vocab/marc/status': BFLITE_URIS.LABEL,
  'http://bibfra.me/vocab/marc/media': BFLITE_URIS.TERM,
  'http://bibfra.me/vocab/marc/carrier': BFLITE_URIS.TERM,
  'http://bibfra.me/vocab/marc/content': BFLITE_URIS.TERM,
  'http://bibfra.me/vocab/lite/classification': BFLITE_URIS.SOURCE,
  'http://bibfra.me/vocab/lite/Person': BFLITE_URIS.NAME,
  'http://bibfra.me/vocab/lite/Family': BFLITE_URIS.NAME,
  'http://bibfra.me/vocab/lite/Organization': BFLITE_URIS.NAME,
  'http://bibfra.me/vocab/lite/Meeting': BFLITE_URIS.NAME,
  'http://bibfra.me/vocab/marc/governmentPublication': BFLITE_URIS.TERM,
  'http://bibfra.me/vocab/marc/targetAudience': BFLITE_URIS.TERM,
  'http://bibfra.me/vocab/marc/originPlace': BFLITE_URIS.NAME,
  'http://bibfra.me/vocab/lite/language': BFLITE_URIS.TERM,
};

export const ADVANCED_FIELDS = {
  'http://bibfra.me/vocab/marc/copyright': {
    valueUri: 'http://bibfra.me/vocab/lite/date',
  },
};

export const BF_URIS = {
  LABEL: 'http://www.w3.org/2000/01/rdf-schema#label',
};

export const BLOCKS_BFLITE = {
  INSTANCE: {
    uri: BFLITE_URIS.INSTANCE,
    referenceKey: '_instanceReference',
    reference: {
      key: '_workReference',
      uri: BFLITE_URIS.WORK,
      name: ResourceType.work,
    },
  },
  WORK: {
    uri: BFLITE_URIS.WORK,
    referenceKey: '_workReference',
    reference: {
      key: '_instanceReference',
      uri: BFLITE_URIS.INSTANCE,
      name: ResourceType.instance,
    },
  },
};

export const BFLITE_BFID_TO_BLOCK = {
  'lc:RT:bf2:Monograph:Instance': BLOCKS_BFLITE.INSTANCE,
  'lc:RT:bf2:Monograph:Work': BLOCKS_BFLITE.WORK,
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
        parentBlock: { bfLiteUri: BLOCKS_BFLITE.INSTANCE.uri },
      },
      'http://bibfra.me/vocab/marc/typeOfReport': {
        uri: 'http://id.loc.gov/vocabulary/mnotetype/report',
        parentBlock: { bfLiteUri: BLOCKS_BFLITE.INSTANCE.uri },
      },
      'http://bibfra.me/vocab/marc/issuanceNote': {
        uri: 'http://id.loc.gov/vocabulary/mnotetype/issuance',
        parentBlock: { bfLiteUri: BLOCKS_BFLITE.INSTANCE.uri },
      },
      'http://bibfra.me/vocab/marc/computerDataNote': {
        uri: 'http://id.loc.gov/vocabulary/mnotetype/computer',
        parentBlock: { bfLiteUri: BLOCKS_BFLITE.INSTANCE.uri },
      },
      'http://bibfra.me/vocab/marc/additionalPhysicalForm': {
        uri: 'http://id.loc.gov/vocabulary/mnotetype/addphys',
        parentBlock: { bfLiteUri: BLOCKS_BFLITE.INSTANCE.uri },
      },
      'http://bibfra.me/vocab/marc/reproductionNote': {
        uri: 'http://id.loc.gov/vocabulary/mnotetype/repro',
        parentBlock: { bfLiteUri: BLOCKS_BFLITE.INSTANCE.uri },
      },
      'http://bibfra.me/vocab/marc/originalVersionNote': {
        uri: 'http://id.loc.gov/vocabulary/mnotetype/orig',
        parentBlock: { bfLiteUri: BLOCKS_BFLITE.INSTANCE.uri },
      },
      'http://bibfra.me/vocab/marc/fundingInformation': {
        uri: 'http://id.loc.gov/vocabulary/mnotetype/fundinfo',
        parentBlock: { bfLiteUri: BLOCKS_BFLITE.INSTANCE.uri },
      },
      'http://bibfra.me/vocab/marc/relatedParts': {
        uri: 'http://id.loc.gov/vocabulary/mnotetype/related',
        parentBlock: { bfLiteUri: BLOCKS_BFLITE.INSTANCE.uri },
      },
      'http://bibfra.me/vocab/marc/issuingBody': {
        uri: 'http://id.loc.gov/vocabulary/mnotetype/issuing',
        parentBlock: { bfLiteUri: BLOCKS_BFLITE.INSTANCE.uri },
      },
      'http://bibfra.me/vocab/marc/locationOfOtherArchivalMaterial': {
        uri: 'http://id.loc.gov/vocabulary/mnotetype/finding',
        parentBlock: { bfLiteUri: BLOCKS_BFLITE.INSTANCE.uri },
      },
      'http://bibfra.me/vocab/marc/exhibitionsNote': {
        uri: 'http://id.loc.gov/vocabulary/mnotetype/exhibit',
        parentBlock: { bfLiteUri: BLOCKS_BFLITE.INSTANCE.uri },
      },
      'http://bibfra.me/vocab/marc/descriptionSourceNote': {
        uri: 'http://id.loc.gov/vocabulary/mnotetype/descsource',
        parentBlock: { bfLiteUri: BLOCKS_BFLITE.INSTANCE.uri },
      },
      'http://bibfra.me/vocab/marc/bibliographyNote': {
        uri: 'http://id.loc.gov/vocabulary/mnotetype/biblio',
        parentBlock: { bfLiteUri: BLOCKS_BFLITE.WORK.uri },
      },
      'http://bibfra.me/vocab/marc/languageNote': {
        uri: 'http://id.loc.gov/vocabulary/mnotetype/lang',
        parentBlock: { bfLiteUri: BLOCKS_BFLITE.WORK.uri },
      },
    },
  },
  [BF2_URIS.CONTRIBUTION]: {
    field: {
      uri: 'http://id.loc.gov/ontologies/bibframe/role',
    },
    data: {
      'http://bibfra.me/vocab/relation/abridger': { uri: 'http://id.loc.gov/vocabulary/relators/abr' },
      'http://bibfra.me/vocab/relation/acp': { uri: 'http://id.loc.gov/vocabulary/relators/acp' },
      'http://bibfra.me/vocab/relation/actor': { uri: 'http://id.loc.gov/vocabulary/relators/act' },
      'http://bibfra.me/vocab/relation/adapter': { uri: 'http://id.loc.gov/vocabulary/relators/adp' },
      'http://bibfra.me/vocab/relation/addressee': { uri: 'http://id.loc.gov/vocabulary/relators/rcp' },
      'http://bibfra.me/vocab/relation/analyst': { uri: 'http://id.loc.gov/vocabulary/relators/anl' },
      'http://bibfra.me/vocab/relation/animator': { uri: 'http://id.loc.gov/vocabulary/relators/anm' },
      'http://bibfra.me/vocab/relation/annotator': { uri: 'http://id.loc.gov/vocabulary/relators/ann' },
      'http://bibfra.me/vocab/relation/appellant': { uri: 'http://id.loc.gov/vocabulary/relators/apl' },
      'http://bibfra.me/vocab/relation/appellee': { uri: 'http://id.loc.gov/vocabulary/relators/ape' },
      'http://bibfra.me/vocab/relation/applicant': { uri: 'http://id.loc.gov/vocabulary/relators/app' },
      'http://bibfra.me/vocab/relation/architect': { uri: 'http://id.loc.gov/vocabulary/relators/arc' },
      'http://bibfra.me/vocab/relation/arranger': { uri: 'http://id.loc.gov/vocabulary/relators/arr' },
      'http://bibfra.me/vocab/relation/artisticdirector': { uri: 'http://id.loc.gov/vocabulary/relators/adi' },
      'http://bibfra.me/vocab/relation/artist': { uri: 'http://id.loc.gov/vocabulary/relators/art' },
      'http://bibfra.me/vocab/relation/artdirector': { uri: 'http://id.loc.gov/vocabulary/relators/ard' },
      'http://bibfra.me/vocab/relation/assignee': { uri: 'http://id.loc.gov/vocabulary/relators/asg' },
      'http://bibfra.me/vocab/relation/associatedname': { uri: 'http://id.loc.gov/vocabulary/relators/asn' },
      'http://bibfra.me/vocab/relation/attributedname': { uri: 'http://id.loc.gov/vocabulary/relators/att' },
      'http://bibfra.me/vocab/relation/auctioneer': { uri: 'http://id.loc.gov/vocabulary/relators/auc' },
      'http://bibfra.me/vocab/relation/author': { uri: 'http://id.loc.gov/vocabulary/relators/aut' },
      'http://bibfra.me/vocab/relation/authorinquotationsortextabstracts': {
        uri: 'http://id.loc.gov/vocabulary/relators/aqt',
      },
      'http://bibfra.me/vocab/relation/authorofafterwordcolophonetc': {
        uri: 'http://id.loc.gov/vocabulary/relators/aft',
      },
      'http://bibfra.me/vocab/relation/authorofdialog': { uri: 'http://id.loc.gov/vocabulary/relators/aud' },
      'http://bibfra.me/vocab/relation/authorofintroductionetc': { uri: 'http://id.loc.gov/vocabulary/relators/aui' },
      'http://bibfra.me/vocab/relation/autographer': { uri: 'http://id.loc.gov/vocabulary/relators/ato' },
      'http://bibfra.me/vocab/relation/bibliographicantecedent': { uri: 'http://id.loc.gov/vocabulary/relators/ant' },
      'http://bibfra.me/vocab/relation/bindingdesigner': { uri: 'http://id.loc.gov/vocabulary/relators/bdd' },
      'http://bibfra.me/vocab/relation/binder': { uri: 'http://id.loc.gov/vocabulary/relators/bnd' },
      'http://bibfra.me/vocab/relation/blurbwriter': { uri: 'http://id.loc.gov/vocabulary/relators/blw' },
      'http://bibfra.me/vocab/relation/bookdesigner': { uri: 'http://id.loc.gov/vocabulary/relators/bkd' },
      'http://bibfra.me/vocab/relation/bookproducer': { uri: 'http://id.loc.gov/vocabulary/relators/bkp' },
      'http://bibfra.me/vocab/relation/bookjacketdesigner': { uri: 'http://id.loc.gov/vocabulary/relators/bjd' },
      'http://bibfra.me/vocab/relation/bookplatedesigner': { uri: 'http://id.loc.gov/vocabulary/relators/bpd' },
      'http://bibfra.me/vocab/relation/bookseller': { uri: 'http://id.loc.gov/vocabulary/relators/bsl' },
      'http://bibfra.me/vocab/relation/brailleembosser': { uri: 'http://id.loc.gov/vocabulary/relators/brl' },
      'http://bibfra.me/vocab/relation/broadcaster': { uri: 'http://id.loc.gov/vocabulary/relators/brd' },
      'http://bibfra.me/vocab/relation/calligrapher': { uri: 'http://id.loc.gov/vocabulary/relators/cll' },
      'http://bibfra.me/vocab/relation/cartographer': { uri: 'http://id.loc.gov/vocabulary/relators/ctg' },
      'http://bibfra.me/vocab/relation/caster': { uri: 'http://id.loc.gov/vocabulary/relators/cas' },
      'http://bibfra.me/vocab/relation/censor': { uri: 'http://id.loc.gov/vocabulary/relators/cns' },
      'http://bibfra.me/vocab/relation/choreographer': { uri: 'http://id.loc.gov/vocabulary/relators/chr' },
      'http://bibfra.me/vocab/relation/cinematographer': { uri: 'http://id.loc.gov/vocabulary/relators/cng' },
      'http://bibfra.me/vocab/relation/client': { uri: 'http://id.loc.gov/vocabulary/relators/cli' },
      'http://bibfra.me/vocab/relation/collectionregistrar': { uri: 'http://id.loc.gov/vocabulary/relators/cor' },
      'http://bibfra.me/vocab/relation/collector': { uri: 'http://id.loc.gov/vocabulary/relators/col' },
      'http://bibfra.me/vocab/relation/collotyper': { uri: 'http://id.loc.gov/vocabulary/relators/clt' },
      'http://bibfra.me/vocab/relation/colorist': { uri: 'http://id.loc.gov/vocabulary/relators/clr' },
      'http://bibfra.me/vocab/relation/commentator': { uri: 'http://id.loc.gov/vocabulary/relators/cmm' },
      'http://bibfra.me/vocab/relation/commentatorforwrittentext': { uri: 'http://id.loc.gov/vocabulary/relators/cwt' },
      'http://bibfra.me/vocab/relation/compiler': { uri: 'http://id.loc.gov/vocabulary/relators/com' },
      'http://bibfra.me/vocab/relation/complainant': { uri: 'http://id.loc.gov/vocabulary/relators/cpl' },
      'http://bibfra.me/vocab/relation/complainant-appellant': { uri: 'http://id.loc.gov/vocabulary/relators/cpt' },
      'http://bibfra.me/vocab/relation/complainant-appellee': { uri: 'http://id.loc.gov/vocabulary/relators/cpe' },
      'http://bibfra.me/vocab/relation/composer': { uri: 'http://id.loc.gov/vocabulary/relators/cmp' },
      'http://bibfra.me/vocab/relation/compositor': { uri: 'http://id.loc.gov/vocabulary/relators/cmt' },
      'http://bibfra.me/vocab/relation/conceptor': { uri: 'http://id.loc.gov/vocabulary/relators/ccp' },
      'http://bibfra.me/vocab/relation/conductor': { uri: 'http://id.loc.gov/vocabulary/relators/cnd' },
      'http://bibfra.me/vocab/relation/conservator': { uri: 'http://id.loc.gov/vocabulary/relators/con' },
      'http://bibfra.me/vocab/relation/consultant': { uri: 'http://id.loc.gov/vocabulary/relators/csl' },
      'http://bibfra.me/vocab/relation/consultanttoaproject': { uri: 'http://id.loc.gov/vocabulary/relators/csp' },
      'http://bibfra.me/vocab/relation/contestant': { uri: 'http://id.loc.gov/vocabulary/relators/cos' },
      'http://bibfra.me/vocab/relation/contestant-appellant': { uri: 'http://id.loc.gov/vocabulary/relators/cot' },
      'http://bibfra.me/vocab/relation/contestant-appellee': { uri: 'http://id.loc.gov/vocabulary/relators/cte' },
      // 'http://bibfra.me/vocab/relation/contestant-appellee': { uri: 'http://id.loc.gov/vocabulary/relators/coe' }, // TODO: update the mapping
      'http://bibfra.me/vocab/relation/contestee': { uri: 'http://id.loc.gov/vocabulary/relators/cts' },
      'http://bibfra.me/vocab/relation/curator': { uri: 'http://id.loc.gov/vocabulary/relators/cur' },
      'http://bibfra.me/vocab/relation/contestee-appellant': { uri: 'http://id.loc.gov/vocabulary/relators/ctt' },
      'http://bibfra.me/vocab/relation/contractor': { uri: 'http://id.loc.gov/vocabulary/relators/ctr' },
      'http://bibfra.me/vocab/relation/costumedesigner': { uri: 'http://id.loc.gov/vocabulary/relators/cst' },
      'http://bibfra.me/vocab/relation/courtreporter': { uri: 'http://id.loc.gov/vocabulary/relators/crt' },
      'http://bibfra.me/vocab/relation/coverdesigner': { uri: 'http://id.loc.gov/vocabulary/relators/cov' },
      'http://bibfra.me/vocab/relation/corrector': { uri: 'http://id.loc.gov/vocabulary/relators/crr' },
      'http://bibfra.me/vocab/relation/correspondent': { uri: 'http://id.loc.gov/vocabulary/relators/crp' },
      'http://bibfra.me/vocab/relation/courtgoverned': { uri: 'http://id.loc.gov/vocabulary/relators/cou' },
      'http://bibfra.me/vocab/relation/copyrightholder': { uri: 'http://id.loc.gov/vocabulary/relators/cph' },
      'http://bibfra.me/vocab/relation/copyrightclaimant': { uri: 'http://id.loc.gov/vocabulary/relators/cpc' },
      'http://bibfra.me/vocab/relation/distributionplace': { uri: 'http://id.loc.gov/vocabulary/relators/dbp' },
      'http://bibfra.me/vocab/relation/defendant': { uri: 'http://id.loc.gov/vocabulary/relators/dfd' },
      'http://bibfra.me/vocab/relation/defendant-appellee': { uri: 'http://id.loc.gov/vocabulary/relators/dfe' },
      'http://bibfra.me/vocab/relation/defendant-appellant': { uri: 'http://id.loc.gov/vocabulary/relators/dft' },
      'http://bibfra.me/vocab/relation/degreegrantinginstitution': { uri: 'http://id.loc.gov/vocabulary/relators/dgg' },
      'http://bibfra.me/vocab/relation/degreecommitteemember': { uri: 'http://id.loc.gov/vocabulary/relators/dgc' },
      'http://bibfra.me/vocab/relation/degreesupervisor': { uri: 'http://id.loc.gov/vocabulary/relators/dgs' },
      'http://bibfra.me/vocab/relation/dissertant': { uri: 'http://id.loc.gov/vocabulary/relators/dis' },
      'http://bibfra.me/vocab/relation/delineator': { uri: 'http://id.loc.gov/vocabulary/relators/dln' },
      'http://bibfra.me/vocab/relation/dancer': { uri: 'http://id.loc.gov/vocabulary/relators/dnc' },
      'http://bibfra.me/vocab/relation/donor': { uri: 'http://id.loc.gov/vocabulary/relators/dnr' },
      'http://bibfra.me/vocab/relation/depicted': { uri: 'http://id.loc.gov/vocabulary/relators/dpc' },
      'http://bibfra.me/vocab/relation/dpt': { uri: 'http://id.loc.gov/vocabulary/relators/dpt' },
      'http://bibfra.me/vocab/relation/draftsman': { uri: 'http://id.loc.gov/vocabulary/relators/drm' },
      'http://bibfra.me/vocab/relation/director': { uri: 'http://id.loc.gov/vocabulary/relators/drt' },
      'http://bibfra.me/vocab/relation/designer': { uri: 'http://id.loc.gov/vocabulary/relators/dsr' },
      'http://bibfra.me/vocab/relation/distributor': { uri: 'http://id.loc.gov/vocabulary/relators/dst' },
      'http://bibfra.me/vocab/relation/datacontributor': { uri: 'http://id.loc.gov/vocabulary/relators/dtc' },
      'http://bibfra.me/vocab/relation/dedicatee': { uri: 'http://id.loc.gov/vocabulary/relators/dte' },
      'http://bibfra.me/vocab/relation/datamanager': { uri: 'http://id.loc.gov/vocabulary/relators/dtm' },
      'http://bibfra.me/vocab/relation/dedicator': { uri: 'http://id.loc.gov/vocabulary/relators/dto' },
      'http://bibfra.me/vocab/relation/dubiousauthor': { uri: 'http://id.loc.gov/vocabulary/relators/dub' },
      'http://bibfra.me/vocab/relation/editorofcompilation': { uri: 'http://id.loc.gov/vocabulary/relators/edc' },
      'http://bibfra.me/vocab/relation/editorofmovingimagework': { uri: 'http://id.loc.gov/vocabulary/relators/edm' },
      'http://bibfra.me/vocab/relation/editor': { uri: 'http://id.loc.gov/vocabulary/relators/edt' },
      'http://bibfra.me/vocab/relation/engraver': { uri: 'http://id.loc.gov/vocabulary/relators/egr' },
      'http://bibfra.me/vocab/relation/electrician': { uri: 'http://id.loc.gov/vocabulary/relators/elg' },
      'http://bibfra.me/vocab/relation/engineer': { uri: 'http://id.loc.gov/vocabulary/relators/eng' },
      'http://bibfra.me/vocab/relation/electrotyper': { uri: 'http://id.loc.gov/vocabulary/relators/elt' },
      'http://bibfra.me/vocab/relation/enactingjurisdiction': { uri: 'http://id.loc.gov/vocabulary/relators/enj' },
      'http://bibfra.me/vocab/relation/etcher': { uri: 'http://id.loc.gov/vocabulary/relators/etr' },
      'http://bibfra.me/vocab/relation/eventplace': { uri: 'http://id.loc.gov/vocabulary/relators/evp' },
      'http://bibfra.me/vocab/relation/expert': { uri: 'http://id.loc.gov/vocabulary/relators/exp' },
      'http://bibfra.me/vocab/relation/facsimilist': { uri: 'http://id.loc.gov/vocabulary/relators/fac' },
      'http://bibfra.me/vocab/relation/filmdistributor': { uri: 'http://id.loc.gov/vocabulary/relators/fds' },
      'http://bibfra.me/vocab/relation/fielddirector': { uri: 'http://id.loc.gov/vocabulary/relators/fld' },
      'http://bibfra.me/vocab/relation/filmeditor': { uri: 'http://id.loc.gov/vocabulary/relators/flm' },
      'http://bibfra.me/vocab/relation/filmdirector': { uri: 'http://id.loc.gov/vocabulary/relators/fmd' },
      'http://bibfra.me/vocab/relation/filmmaker': { uri: 'http://id.loc.gov/vocabulary/relators/fmk' },
      'http://bibfra.me/vocab/relation/formerowner': { uri: 'http://id.loc.gov/vocabulary/relators/fmo' },
      'http://bibfra.me/vocab/relation/filmproducer': { uri: 'http://id.loc.gov/vocabulary/relators/fmp' },
      'http://bibfra.me/vocab/relation/funder': { uri: 'http://id.loc.gov/vocabulary/relators/fnd' },
      'http://bibfra.me/vocab/relation/firstparty': { uri: 'http://id.loc.gov/vocabulary/relators/fpy' },
      'http://bibfra.me/vocab/relation/forger': { uri: 'http://id.loc.gov/vocabulary/relators/frg' },
      'http://bibfra.me/vocab/relation/geographicinformationspecialist': {
        uri: 'http://id.loc.gov/vocabulary/relators/gis',
      },
      'http://bibfra.me/vocab/relation/graphictechnician': { uri: 'http://id.loc.gov/vocabulary/relators/grt' },
      'http://bibfra.me/vocab/relation/hostinstitution': { uri: 'http://id.loc.gov/vocabulary/relators/his' },
      'http://bibfra.me/vocab/relation/host': { uri: 'http://id.loc.gov/vocabulary/relators/hst' },
      'http://bibfra.me/vocab/relation/honoree': { uri: 'http://id.loc.gov/vocabulary/relators/hnr' },
      'http://bibfra.me/vocab/relation/illustrator': { uri: 'http://id.loc.gov/vocabulary/relators/ill' },
      'http://bibfra.me/vocab/relation/illuminator': { uri: 'http://id.loc.gov/vocabulary/relators/ilu' },
      'http://bibfra.me/vocab/relation/inscriber': { uri: 'http://id.loc.gov/vocabulary/relators/ins' },
      'http://bibfra.me/vocab/relation/inventor': { uri: 'http://id.loc.gov/vocabulary/relators/inv' },
      'http://bibfra.me/vocab/relation/issuingbody': { uri: 'http://id.loc.gov/vocabulary/relators/isb' },
      'http://bibfra.me/vocab/relation/instrumentalist': { uri: 'http://id.loc.gov/vocabulary/relators/itr' },
      'http://bibfra.me/vocab/relation/interviewee': { uri: 'http://id.loc.gov/vocabulary/relators/ive' },
      'http://bibfra.me/vocab/relation/interviewer': { uri: 'http://id.loc.gov/vocabulary/relators/ivr' },
      'http://bibfra.me/vocab/relation/judge': { uri: 'http://id.loc.gov/vocabulary/relators/jud' },
      'http://bibfra.me/vocab/relation/jurisdictiongoverned': { uri: 'http://id.loc.gov/vocabulary/relators/jug' },
      'http://bibfra.me/vocab/relation/laboratory': { uri: 'http://id.loc.gov/vocabulary/relators/lbr' },
      'http://bibfra.me/vocab/relation/librettist': { uri: 'http://id.loc.gov/vocabulary/relators/lbt' },
      'http://bibfra.me/vocab/relation/labdirector': { uri: 'http://id.loc.gov/vocabulary/relators/ldr' },
      'http://bibfra.me/vocab/relation/lead': { uri: 'http://id.loc.gov/vocabulary/relators/led' },
      'http://bibfra.me/vocab/relation/libelant-appellee': { uri: 'http://id.loc.gov/vocabulary/relators/lee' },
      'http://bibfra.me/vocab/relation/libelee': { uri: 'http://id.loc.gov/vocabulary/relators/lel' },
      'http://bibfra.me/vocab/relation/lender': { uri: 'http://id.loc.gov/vocabulary/relators/len' },
      'http://bibfra.me/vocab/relation/libelant-appellant': { uri: 'http://id.loc.gov/vocabulary/relators/let' },
      'http://bibfra.me/vocab/relation/lightingdesigner': { uri: 'http://id.loc.gov/vocabulary/relators/lgd' },
      'http://bibfra.me/vocab/relation/libelee-appellee': { uri: 'http://id.loc.gov/vocabulary/relators/lie' },
      'http://bibfra.me/vocab/relation/libelant': { uri: 'http://id.loc.gov/vocabulary/relators/lil' },
      'http://bibfra.me/vocab/relation/libelee-appellant': { uri: 'http://id.loc.gov/vocabulary/relators/lit' },
      'http://bibfra.me/vocab/relation/landscapearchitect': { uri: 'http://id.loc.gov/vocabulary/relators/lsa' },
      'http://bibfra.me/vocab/relation/licensee': { uri: 'http://id.loc.gov/vocabulary/relators/lse' },
      'http://bibfra.me/vocab/relation/licensor': { uri: 'http://id.loc.gov/vocabulary/relators/lso' },
      'http://bibfra.me/vocab/relation/lithographer': { uri: 'http://id.loc.gov/vocabulary/relators/ltg' },
      'http://bibfra.me/vocab/relation/lyricist': { uri: 'http://id.loc.gov/vocabulary/relators/lyr' },
      'http://bibfra.me/vocab/relation/musiccopyist': { uri: 'http://id.loc.gov/vocabulary/relators/mcp' },
      'http://bibfra.me/vocab/relation/metadatacontact': { uri: 'http://id.loc.gov/vocabulary/relators/mdc' },
      'http://bibfra.me/vocab/relation/manufactureplace': { uri: 'http://id.loc.gov/vocabulary/relators/mfp' },
      'http://bibfra.me/vocab/relation/medium': { uri: 'http://id.loc.gov/vocabulary/relators/med' },
      'http://bibfra.me/vocab/relation/manufacturer': { uri: 'http://id.loc.gov/vocabulary/relators/mfr' },
      'http://bibfra.me/vocab/relation/moderator': { uri: 'http://id.loc.gov/vocabulary/relators/mod' },
      'http://bibfra.me/vocab/relation/marbler': { uri: 'http://id.loc.gov/vocabulary/relators/mrb' },
      'http://bibfra.me/vocab/relation/markupeditor': { uri: 'http://id.loc.gov/vocabulary/relators/mrk' },
      'http://bibfra.me/vocab/relation/musicaldirector': { uri: 'http://id.loc.gov/vocabulary/relators/msd' },
      'http://bibfra.me/vocab/relation/monitor': { uri: 'http://id.loc.gov/vocabulary/relators/mon' },
      'http://bibfra.me/vocab/relation/metal-engraver': { uri: 'http://id.loc.gov/vocabulary/relators/mte' },
      'http://bibfra.me/vocab/relation/minutetaker': { uri: 'http://id.loc.gov/vocabulary/relators/mtk' },
      'http://bibfra.me/vocab/relation/musician': { uri: 'http://id.loc.gov/vocabulary/relators/mus' },
      'http://bibfra.me/vocab/relation/narrator': { uri: 'http://id.loc.gov/vocabulary/relators/nrt' },
      'http://bibfra.me/vocab/relation/opponent': { uri: 'http://id.loc.gov/vocabulary/relators/opn' },
      'http://bibfra.me/vocab/relation/originator': { uri: 'http://id.loc.gov/vocabulary/relators/org' },
      'http://bibfra.me/vocab/relation/organizer': { uri: 'http://id.loc.gov/vocabulary/relators/orm' },
      'http://bibfra.me/vocab/relation/onscreenpresenter': { uri: 'http://id.loc.gov/vocabulary/relators/osp' },
      'http://bibfra.me/vocab/relation/other': { uri: 'http://id.loc.gov/vocabulary/relators/oth' },
      'http://bibfra.me/vocab/relation/owner': { uri: 'http://id.loc.gov/vocabulary/relators/own' },
      'http://bibfra.me/vocab/relation/panelist': { uri: 'http://id.loc.gov/vocabulary/relators/pan' },
      'http://bibfra.me/vocab/relation/patron': { uri: 'http://id.loc.gov/vocabulary/relators/pat' },
      'http://bibfra.me/vocab/relation/publishingdirector': { uri: 'http://id.loc.gov/vocabulary/relators/pbd' },
      'http://bibfra.me/vocab/relation/publisher': { uri: 'http://id.loc.gov/vocabulary/relators/pbl' },
      'http://bibfra.me/vocab/relation/projectdirector': { uri: 'http://id.loc.gov/vocabulary/relators/pdr' },
      'http://bibfra.me/vocab/relation/platemaker': { uri: 'http://id.loc.gov/vocabulary/relators/plt' },
      'http://bibfra.me/vocab/relation/permittingagency': { uri: 'http://id.loc.gov/vocabulary/relators/pma' },
      'http://bibfra.me/vocab/relation/proofreader': { uri: 'http://id.loc.gov/vocabulary/relators/pfr' },
      'http://bibfra.me/vocab/relation/photographer': { uri: 'http://id.loc.gov/vocabulary/relators/pht' },
      'http://bibfra.me/vocab/relation/productionmanager': { uri: 'http://id.loc.gov/vocabulary/relators/pmn' },
      'http://bibfra.me/vocab/relation/printerofplates': { uri: 'http://id.loc.gov/vocabulary/relators/pop' },
      'http://bibfra.me/vocab/relation/papermaker': { uri: 'http://id.loc.gov/vocabulary/relators/ppm' },
      'http://bibfra.me/vocab/relation/puppeteer': { uri: 'http://id.loc.gov/vocabulary/relators/ppt' },
      'http://bibfra.me/vocab/relation/printmaker': { uri: 'http://id.loc.gov/vocabulary/relators/prm' },
      'http://bibfra.me/vocab/relation/praeses': { uri: 'http://id.loc.gov/vocabulary/relators/pra' },
      'http://bibfra.me/vocab/relation/processcontact': { uri: 'http://id.loc.gov/vocabulary/relators/prc' },
      'http://bibfra.me/vocab/relation/productionpersonnel': { uri: 'http://id.loc.gov/vocabulary/relators/prd' },
      'http://bibfra.me/vocab/relation/presenter': { uri: 'http://id.loc.gov/vocabulary/relators/pre' },
      'http://bibfra.me/vocab/relation/performer': { uri: 'http://id.loc.gov/vocabulary/relators/prf' },
      'http://bibfra.me/vocab/relation/programmer': { uri: 'http://id.loc.gov/vocabulary/relators/prg' },
      'http://bibfra.me/vocab/relation/productioncompany': { uri: 'http://id.loc.gov/vocabulary/relators/prn' },
      'http://bibfra.me/vocab/relation/producer': { uri: 'http://id.loc.gov/vocabulary/relators/pro' },
      'http://bibfra.me/vocab/relation/productionplace': { uri: 'http://id.loc.gov/vocabulary/relators/prp' },
      'http://bibfra.me/vocab/relation/productiondesigner': { uri: 'http://id.loc.gov/vocabulary/relators/prs' },
      'http://bibfra.me/vocab/relation/printer': { uri: 'http://id.loc.gov/vocabulary/relators/prt' },
      'http://bibfra.me/vocab/relation/provider': { uri: 'http://id.loc.gov/vocabulary/relators/prv' },
      'http://bibfra.me/vocab/relation/patentapplicant': { uri: 'http://id.loc.gov/vocabulary/relators/pta' },
      'http://bibfra.me/vocab/relation/plaintiff-appellee': { uri: 'http://id.loc.gov/vocabulary/relators/pte' },
      'http://bibfra.me/vocab/relation/plaintiff': { uri: 'http://id.loc.gov/vocabulary/relators/ptf' },
      'http://bibfra.me/vocab/relation/patentholder': { uri: 'http://id.loc.gov/vocabulary/relators/pth' },
      'http://bibfra.me/vocab/relation/plaintiff-appellant': { uri: 'http://id.loc.gov/vocabulary/relators/ptt' },
      'http://bibfra.me/vocab/relation/publicationplace': { uri: 'http://id.loc.gov/vocabulary/relators/pup' },
      'http://bibfra.me/vocab/relation/rubricator': { uri: 'http://id.loc.gov/vocabulary/relators/rbr' },
      'http://bibfra.me/vocab/relation/recordist': { uri: 'http://id.loc.gov/vocabulary/relators/rcd' },
      'http://bibfra.me/vocab/relation/recordingengineer': { uri: 'http://id.loc.gov/vocabulary/relators/rce' },
      'http://bibfra.me/vocab/relation/radiodirector': { uri: 'http://id.loc.gov/vocabulary/relators/rdd' },
      'http://bibfra.me/vocab/relation/redaktor': { uri: 'http://id.loc.gov/vocabulary/relators/red' },
      'http://bibfra.me/vocab/relation/renderer': { uri: 'http://id.loc.gov/vocabulary/relators/ren' },
      'http://bibfra.me/vocab/relation/researcher': { uri: 'http://id.loc.gov/vocabulary/relators/res' },
      'http://bibfra.me/vocab/relation/reviewer': { uri: 'http://id.loc.gov/vocabulary/relators/rev' },
      'http://bibfra.me/vocab/relation/radioproducer': { uri: 'http://id.loc.gov/vocabulary/relators/rpc' },
      'http://bibfra.me/vocab/relation/repository': { uri: 'http://id.loc.gov/vocabulary/relators/rps' },
      'http://bibfra.me/vocab/relation/reporter': { uri: 'http://id.loc.gov/vocabulary/relators/rpt' },
      'http://bibfra.me/vocab/relation/responsibleparty': { uri: 'http://id.loc.gov/vocabulary/relators/rpy' },
      'http://bibfra.me/vocab/relation/respondent-appellee': { uri: 'http://id.loc.gov/vocabulary/relators/rse' },
      'http://bibfra.me/vocab/relation/restager': { uri: 'http://id.loc.gov/vocabulary/relators/rsg' },
      'http://bibfra.me/vocab/relation/respondent': { uri: 'http://id.loc.gov/vocabulary/relators/rsp' },
      'http://bibfra.me/vocab/relation/restorationist': { uri: 'http://id.loc.gov/vocabulary/relators/rsr' },
      'http://bibfra.me/vocab/relation/respondent-appellant': { uri: 'http://id.loc.gov/vocabulary/relators/rst' },
      'http://bibfra.me/vocab/relation/researchteamhead': { uri: 'http://id.loc.gov/vocabulary/relators/rth' },
      'http://bibfra.me/vocab/relation/researchteammember': { uri: 'http://id.loc.gov/vocabulary/relators/rtm' },
      'http://bibfra.me/vocab/relation/scientificadvisor': { uri: 'http://id.loc.gov/vocabulary/relators/sad' },
      'http://bibfra.me/vocab/relation/scenarist': { uri: 'http://id.loc.gov/vocabulary/relators/sce' },
      'http://bibfra.me/vocab/relation/sculptor': { uri: 'http://id.loc.gov/vocabulary/relators/scl' },
      'http://bibfra.me/vocab/relation/scribe': { uri: 'http://id.loc.gov/vocabulary/relators/scr' },
      'http://bibfra.me/vocab/relation/sounddesigner': { uri: 'http://id.loc.gov/vocabulary/relators/sds' },
      'http://bibfra.me/vocab/relation/secretary': { uri: 'http://id.loc.gov/vocabulary/relators/sec' },
      'http://bibfra.me/vocab/relation/stagedirector': { uri: 'http://id.loc.gov/vocabulary/relators/sgd' },
      'http://bibfra.me/vocab/relation/signer': { uri: 'http://id.loc.gov/vocabulary/relators/sgn' },
      'http://bibfra.me/vocab/relation/supportinghost': { uri: 'http://id.loc.gov/vocabulary/relators/sht' },
      'http://bibfra.me/vocab/relation/screenwriter': { uri: 'http://id.loc.gov/vocabulary/relators/aus' },
      'http://bibfra.me/vocab/relation/seller': { uri: 'http://id.loc.gov/vocabulary/relators/sll' },
      'http://bibfra.me/vocab/relation/singer': { uri: 'http://id.loc.gov/vocabulary/relators/sng' },
      'http://bibfra.me/vocab/relation/speaker': { uri: 'http://id.loc.gov/vocabulary/relators/spk' },
      'http://bibfra.me/vocab/relation/sponsor': { uri: 'http://id.loc.gov/vocabulary/relators/spn' },
      'http://bibfra.me/vocab/relation/secondparty': { uri: 'http://id.loc.gov/vocabulary/relators/spy' },
      'http://bibfra.me/vocab/relation/surveyor': { uri: 'http://id.loc.gov/vocabulary/relators/srv' },
      'http://bibfra.me/vocab/relation/setdesigner': { uri: 'http://id.loc.gov/vocabulary/relators/std' },
      'http://bibfra.me/vocab/relation/setting': { uri: 'http://id.loc.gov/vocabulary/relators/stg' },
      'http://bibfra.me/vocab/relation/storyteller': { uri: 'http://id.loc.gov/vocabulary/relators/stl' },
      'http://bibfra.me/vocab/relation/stagemanager': { uri: 'http://id.loc.gov/vocabulary/relators/stm' },
      'http://bibfra.me/vocab/relation/standardsbody': { uri: 'http://id.loc.gov/vocabulary/relators/stn' },
      'http://bibfra.me/vocab/relation/stereotyper': { uri: 'http://id.loc.gov/vocabulary/relators/str' },
      'http://bibfra.me/vocab/relation/technicaldirector': { uri: 'http://id.loc.gov/vocabulary/relators/tcd' },
      'http://bibfra.me/vocab/relation/teacher': { uri: 'http://id.loc.gov/vocabulary/relators/tch' },
      'http://bibfra.me/vocab/relation/thesisadvisor': { uri: 'http://id.loc.gov/vocabulary/relators/ths' },
      'http://bibfra.me/vocab/relation/televisiondirector': { uri: 'http://id.loc.gov/vocabulary/relators/tld' },
      'http://bibfra.me/vocab/relation/televisionproducer': { uri: 'http://id.loc.gov/vocabulary/relators/tlp' },
      'http://bibfra.me/vocab/relation/transcriber': { uri: 'http://id.loc.gov/vocabulary/relators/trc' },
      'http://bibfra.me/vocab/relation/translator': { uri: 'http://id.loc.gov/vocabulary/relators/trl' },
      'http://bibfra.me/vocab/relation/typedesigner': { uri: 'http://id.loc.gov/vocabulary/relators/tyd' },
      'http://bibfra.me/vocab/relation/typographer': { uri: 'http://id.loc.gov/vocabulary/relators/tyg' },
      'http://bibfra.me/vocab/relation/universityplace': { uri: 'http://id.loc.gov/vocabulary/relators/uvp' },
      'http://bibfra.me/vocab/relation/voiceactor': { uri: 'http://id.loc.gov/vocabulary/relators/vac' },
      'http://bibfra.me/vocab/relation/videographer': { uri: 'http://id.loc.gov/vocabulary/relators/vdg' },
      'http://bibfra.me/vocab/relation/vocalist': { uri: 'http://id.loc.gov/vocabulary/relators/voc' },
      'http://bibfra.me/vocab/relation/writerofaddedcommentary': { uri: 'http://id.loc.gov/vocabulary/relators/wac' },
      'http://bibfra.me/vocab/relation/writerofaddedlyrics': { uri: 'http://id.loc.gov/vocabulary/relators/wal' },
      'http://bibfra.me/vocab/relation/writerofaccompanyingmaterial': {
        uri: 'http://id.loc.gov/vocabulary/relators/wam',
      },
      'http://bibfra.me/vocab/relation/writerofaddedtext': { uri: 'http://id.loc.gov/vocabulary/relators/wat' },
      'http://bibfra.me/vocab/relation/woodcutter': { uri: 'http://id.loc.gov/vocabulary/relators/wdc' },
      'http://bibfra.me/vocab/relation/woodengraver': { uri: 'http://id.loc.gov/vocabulary/relators/wde' },
      'http://bibfra.me/vocab/relation/writerofintroduction': { uri: 'http://id.loc.gov/vocabulary/relators/win' },
      'http://bibfra.me/vocab/relation/witness': { uri: 'http://id.loc.gov/vocabulary/relators/wit' },
      'http://bibfra.me/vocab/relation/writerofpreface': { uri: 'http://id.loc.gov/vocabulary/relators/wpr' },
      'http://bibfra.me/vocab/relation/writerofsupplementarytextualcontent': {
        uri: 'http://id.loc.gov/vocabulary/relators/wst',
      },
    },
  },
};

export const NEW_BF2_TO_BFLITE_MAPPING = {
  [BFLITE_URIS.INSTANCE]: {
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
    'http://bibfra.me/vocab/marc/statementOfResponsibility': {
      container: { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/responsibilityStatement' },
    },
    'http://bibfra.me/vocab/marc/edition': {
      container: { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/editionStatement' },
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
        'http://bibfra.me/vocab/lite/providerPlace': {
          bf2Uri: 'http://id.loc.gov/ontologies/bibframe/place',
          label: BFLITE_URIS.LABEL,
        },
        'http://bibfra.me/vocab/lite/place': { bf2Uri: 'http://id.loc.gov/ontologies/bflc/simplePlace' },
        'http://bibfra.me/vocab/lite/name': { bf2Uri: 'http://id.loc.gov/ontologies/bflc/simpleAgent' },
        'http://bibfra.me/vocab/lite/date': { bf2Uri: 'http://id.loc.gov/ontologies/bflc/simpleDate' },
      },
    },
    'http://bibfra.me/vocab/marc/issuance': {
      container: { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/issuance' },
      fields: {
        'http://bibfra.me/vocab/marc/issuance': {
          bf2Uri: 'http://id.loc.gov/ontologies/bibframe/issuance',
          label: BFLITE_URIS.LABEL,
        },
      },
    },
    'http://bibfra.me/vocab/marc/copyright': {
      container: { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/copyrightDate' },
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
        'http://bibfra.me/vocab/marc/status': {
          bf2Uri: 'http://id.loc.gov/ontologies/bibframe/status',
          label: BFLITE_URIS.LABEL,
        },
        'http://bibfra.me/vocab/marc/qualifier': { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/qualifier' },
        'http://bibfra.me/vocab/marc/localId': { bf2Uri: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#value' },
        'http://bibfra.me/vocab/marc/localIdAssigningSource': {
          bf2Uri: 'http://id.loc.gov/ontologies/bibframe/assigner',
        },
        'http://bibfra.me/vocab/marc/ean': { bf2Uri: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#value' },
      },
    },
    'http://bibfra.me/vocab/marc/supplementaryContent': {
      container: { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/supplementaryContent' },
      fields: {
        'http://bibfra.me/vocab/lite/name': { bf2Uri: 'http://www.w3.org/2000/01/rdf-schema#label' },
        'http://www.w3.org/1999/02/22-rdf-syntax-ns#value': { bf2Uri: 'http://bibfra.me/vocab/lite/link' },
      },
    },
    [NON_BF_RECORD_ELEMENTS[BFLITE_URIS.NOTE].container]: {
      container: { bf2Uri: BF2_URIS.NOTE },
      fields: {
        value: { bf2Uri: 'http://www.w3.org/2000/01/rdf-schema#label' },
        type: {
          bf2Uri: 'http://id.loc.gov/ontologies/bibframe/noteType',
          label: BFLITE_URIS.LABEL,
        },
      },
    },
    'http://bibfra.me/vocab/marc/media': {
      container: { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/media' },
      fields: {
        'http://bibfra.me/vocab/marc/media': {
          bf2Uri: 'http://id.loc.gov/ontologies/bibframe/dimensions',
          label: BFLITE_URIS.TERM,
        },
      },
    },
    'http://bibfra.me/vocab/marc/dimensions': {
      container: { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/dimensions' },
    },
    'http://bibfra.me/vocab/marc/carrier': {
      container: {
        bf2Uri: 'http://id.loc.gov/ontologies/bibframe/carrier',
        label: BFLITE_URIS.TERM,
      },
      fields: {
        'http://bibfra.me/vocab/marc/carrier': {
          bf2Uri: 'http://id.loc.gov/ontologies/bibframe/carrier',
          label: BFLITE_URIS.TERM,
        },
      },
    },
    'http://bibfra.me/vocab/marc/accessLocation': {
      container: { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/electronicLocator' },
      fields: {
        'http://bibfra.me/vocab/lite/link': { bf2Uri: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#value' },
        'http://bibfra.me/vocab/lite/note': { bf2Uri: 'http://www.w3.org/2000/01/rdf-schema#label' },
      },
    },
    'http://bibfra.me/vocab/lite/extent': {
      container: { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/extent' },
      fields: {
        _extent: { bf2Uri: 'http://www.w3.org/2000/01/rdf-schema#label' },
      },
    },
  },
  [BFLITE_URIS.WORK]: {
    _creatorReference: {
      container: {
        bf2Uri: 'http://id.loc.gov/ontologies/bibframe/contribution',
        dataTypeUri: 'http://id.loc.gov/ontologies/bflc/PrimaryContribution',
      },
      options: {
        'http://bibfra.me/vocab/lite/Person': { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/Person' },
        'http://bibfra.me/vocab/lite/Family': { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/Family' },
        'http://bibfra.me/vocab/lite/Organization': { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/Organization' },
        'http://bibfra.me/vocab/lite/Meeting': { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/Meeting' },
      },
      fields: {
        label: { bf2Uri: 'http://www.w3.org/2002/07/owl#sameAs' },
        roles: {
          bf2Uri: 'http://id.loc.gov/ontologies/bibframe/role',
          label: BFLITE_URIS.LABEL,
        },
      },
    },
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
        'http://bibfra.me/vocab/lite/date': { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/date' },
        'http://bibfra.me/vocab/marc/variantType': { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/variantType' },
        'http://bibfra.me/vocab/lite/note': { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/note' },
      },
    },
    'http://bibfra.me/vocab/marc/governmentPublication': {
      container: { bf2Uri: 'http://id.loc.gov/ontologies/bflc/governmentPubType', label: BFLITE_URIS.TERM },
      fields: {
        'http://bibfra.me/vocab/marc/governmentPublication': {
          bf2Uri: 'http://id.loc.gov/ontologies/bflc/governmentPubType',
          label: BFLITE_URIS.TERM,
        },
      },
    },
    'http://bibfra.me/vocab/lite/dateStart': {
      container: { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/originDate' },
      fields: {
        'http://bibfra.me/vocab/lite/dateStart': {
          bf2Uri: 'http://id.loc.gov/ontologies/bibframe/originDate',
        },
      },
    },
    'http://bibfra.me/vocab/marc/originPlace': {
      container: { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/originPlace' },
      fields: {
        'http://bibfra.me/vocab/marc/originPlace': {
          bf2Uri: 'http://id.loc.gov/ontologies/bibframe/originPlace',
          label: BFLITE_URIS.NAME,
        },
      },
    },
    _geographicCoverageReference: {
      container: { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/geographicCoverage' },
      fields: {
        label: {
          bf2Uri: 'http://www.w3.org/2002/07/owl#sameAs',
        },
      },
    },
    'http://bibfra.me/vocab/marc/targetAudience': {
      container: { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/intendedAudience' },
      fields: {
        'http://bibfra.me/vocab/marc/targetAudience': {
          bf2Uri: 'http://id.loc.gov/ontologies/bibframe/intendedAudience',
          label: BFLITE_URIS.TERM,
        },
      },
    },
    _contributorReference: {
      container: {
        bf2Uri: 'http://id.loc.gov/ontologies/bibframe/contribution',
        dataTypeUri: 'http://id.loc.gov/ontologies/bibframe/Contribution',
      },
      options: {
        'http://bibfra.me/vocab/lite/Person': { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/Person' },
        'http://bibfra.me/vocab/lite/Family': { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/Family' },
        'http://bibfra.me/vocab/lite/Organization': { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/Organization' },
        'http://bibfra.me/vocab/lite/Meeting': { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/Meeting' },
      },
      fields: {
        label: { bf2Uri: 'http://www.w3.org/2002/07/owl#sameAs' },
        roles: {
          bf2Uri: 'http://id.loc.gov/ontologies/bibframe/role',
          label: BFLITE_URIS.LABEL,
        },
      },
    },
    [NON_BF_RECORD_ELEMENTS[BFLITE_URIS.NOTE].container]: {
      container: { bf2Uri: BF2_URIS.NOTE },
      fields: {
        value: { bf2Uri: 'http://www.w3.org/2000/01/rdf-schema#label' },
        type: {
          bf2Uri: 'http://id.loc.gov/ontologies/bibframe/noteType',
          label: BFLITE_URIS.LABEL,
        },
      },
    },
    'http://bibfra.me/vocab/lite/language': {
      container: { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/language' },
      fields: {
        _language: {
          bf2Uri: 'http://www.w3.org/2002/07/owl#sameAs',
          label: BFLITE_URIS.TERM,
        },
      },
    },
    'http://bibfra.me/vocab/marc/content': {
      container: { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/content' },
      fields: {
        'http://bibfra.me/vocab/marc/content': {
          bf2Uri: 'http://id.loc.gov/ontologies/bibframe/content',
          label: BFLITE_URIS.TERM,
        },
      },
    },
    'http://bibfra.me/vocab/marc/summary': {
      container: { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/summary' },
      fields: {
        _notes: { bf2Uri: 'http://www.w3.org/2000/01/rdf-schema#label' },
      },
    },
    'http://bibfra.me/vocab/marc/tableOfContents': {
      container: { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/tableOfContents' },
      fields: {
        _notes: { bf2Uri: 'http://www.w3.org/2000/01/rdf-schema#label' },
      },
    },
    'http://bibfra.me/vocab/lite/subject': {
      container: { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/subject' },
      fields: {
        label: { bf2Uri: 'http://www.loc.gov/mads/rdf/v1#Topic' },
      },
    },
    'http://bibfra.me/vocab/lite/classification': {
      container: { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/classification' },
      options: {
        ddc: { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/ClassificationDdc' },
        lc: { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/ClassificationLcc' },
      },
      fields: {
        'http://bibfra.me/vocab/marc/code': {
          bf2Uri: 'http://id.loc.gov/ontologies/bibframe/classificationPortion',
        },
        'http://bibfra.me/vocab/marc/itemNumber': { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/itemPortion' },
        'http://bibfra.me/vocab/marc/source': { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/classification' },
        'http://bibfra.me/vocab/marc/edition': { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/edition' },
        'http://bibfra.me/vocab/marc/editionNumber': { bf2Uri: 'http://id.loc.gov/ontologies/bibframe/code' },
        'http://bibfra.me/vocab/marc/status': {
          bf2Uri: 'http://id.loc.gov/ontologies/bibframe/status',
          label: BFLITE_URIS.LABEL,
        },
        _assigningSourceReference: {
          bf2Uri: 'http://id.loc.gov/ontologies/bibframe/assigner',
        },
      },
    },
  },
};

export const BFLITE_TYPES_MAP = {
  [NON_BF_RECORD_ELEMENTS[BFLITE_URIS.NOTE].container]: {
    field: TYPE_MAP[BF2_URIS.NOTE].field,
    data: TYPE_MAP[BF2_URIS.NOTE].data,
  },
  _creatorReference: {
    field: '',
    data: {},
    fields: {
      [NON_BF_RECORD_ELEMENTS[BFLITE_URIS.CREATOR].container]: {
        field: TYPE_MAP[BF2_URIS.CONTRIBUTION].field,
        data: TYPE_MAP[BF2_URIS.CONTRIBUTION].data,
      },
    },
  },
  _contributorReference: {
    field: '',
    data: {},
    fields: {
      [NON_BF_RECORD_ELEMENTS[BFLITE_URIS.CONTRIBUTOR].container]: {
        field: TYPE_MAP[BF2_URIS.CONTRIBUTION].field,
        data: TYPE_MAP[BF2_URIS.CONTRIBUTION].data,
      },
    },
  },
};

export const DEFAULT_GROUP_VALUES = {
  [NON_BF_RECORD_ELEMENTS[BFLITE_URIS.NOTE].container]: { value: BFLITE_URIS.NOTE },
};
