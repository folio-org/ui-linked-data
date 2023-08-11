export const BF2_TO_BFLITE_MAP: BFLiteMap = {
  'http://id.loc.gov/ontologies/bibframe/title': 'https://bibfra.me/vocab/lite/title',
  'http://id.loc.gov/ontologies/bibframe/Title': 'http://bibfra.me/vocab/lite/Title', // TODO: New bibframe lite class created by PK. Review with Gloria
  'http://id.loc.gov/ontologies/bflc/nonSortNum': 'http://bibfra.me/vocab/marc/nonSortNum',
  'http://id.loc.gov/ontologies/bibframe/mainTitle': 'https://bibfra.me/vocab/marc/mainTitle',
  'http://id.loc.gov/ontologies/bibframe/partNumber': 'http://bibfra.me/vocab/marc/partNumber',
  'http://id.loc.gov/ontologies/bibframe/partName': 'http://bibfra.me/vocab/marc/partName',
  'http://id.loc.gov/ontologies/bibframe/subtitle': 'http://bibfra.me/vocab/marc/subTitle',
  'http://id.loc.gov/ontologies/bibframe/VariantTitle': 'http://bibfra.me/vocab/lite/VariantTitle', // TODO: New bibframe lite class created by PK. Review with Gloria
  'http://id.loc.gov/ontologies/bibframe/date': 'http://bibfra.me/vocab/lite/date',
  'http://id.loc.gov/ontologies/bibframe/variantType': 'http://bibfra.me/vocab/marc/variantType', // TODO: New bibframe lite field created by PK
  'http://id.loc.gov/ontologies/bibframe/note': 'http://bibfra.me/vocab/lite/note',
  'http://www.w3.org/2000/01/rdf-schema#label': '', // TODO: ????
  'http://id.loc.gov/ontologies/bibframe/ParallelTitle': 'http://bibfra.me/vocab/lite/ParallelTitle', // TODO: New bibframe lite class created by PK. Review with Gloria
  'http://id.loc.gov/ontologies/bibframe/responsibilityStatement':
    'https://bibfra.me/vocab/marc/statementOfResponsibility',
  'http://id.loc.gov/ontologies/bibframe/editionStatement': 'https://bibfra.me/vocab/marc/edition',
  'http://id.loc.gov/ontologies/bibframe/provisionActivity': 'https://bibfra.me/vocab/marc/provisionActivity',
  'http://id.loc.gov/ontologies/bibframe/Publication': 'http://bibfra.me/vocab/lite/Publication', // TODO: New bibframe lite class created by PK. Review with Gloria
  'http://id.loc.gov/ontologies/bibframe/place': 'https://bibfra.me/vocab/lite/country',
  'http://id.loc.gov/ontologies/bflc/simplePlace': 'http://bibfra.me/vocab/relation/publicationplace',
  'http://id.loc.gov/ontologies/bflc/simpleAgent': 'http://bibfra.me/vocab/lite/providerAgent',
  'http://id.loc.gov/ontologies/bflc/simpleDate': 'http://bibfra.me/vocab/lite/date',
  'http://id.loc.gov/ontologies/bibframe/Distribution': 'http://bibfra.me/vocab/lite/Manufacture', // TODO: New bibframe lite class created by PK. Review with Gloria
  'http://id.loc.gov/ontologies/bibframe/copyrightDate': 'http://bibfra.me/vocab/lite/copyrightDate',
  'http://id.loc.gov/ontologies/bibframe/Manufacture': 'http://bibfra.me/vocab/lite/Manufacture', // TODO: New bibframe lite class created by PK. Review with Gloria
  'http://id.loc.gov/ontologies/bibframe/Production': 'http://bibfra.me/vocab/lite/Production', // TODO: New bibframe lite class created by PK. Review with Gloria
  'http://id.loc.gov/ontologies/bibframe/contribution': '', // TODO
  'http://id.loc.gov/ontologies/bibframe/issuance': 'http://bibfra.me/vocab/marc/issuance',
  'http://id.loc.gov/ontologies/bibframe/identifiedBy': '', // TODO
  'http://id.loc.gov/ontologies/bibframe/Lccn': 'http://bibfra.me/vocab/lite/Lccn', // TODO: New bibframe lite class created by PK. Review with Gloria
  'http://id.loc.gov/ontologies/bibframe/status': 'http://bibfra.me/vocab/marc/status',
  'http://id.loc.gov/ontologies/bibframe/Isbn': 'http://bibfra.me/vocab/lite/Isbn', // TODO: New bibframe lite class created by PK. Review with Gloria
  'http://id.loc.gov/ontologies/bibframe/qualifier': 'http://bibfra.me/vocab/marc/qualifier',
  '@type: http://id.loc.gov/ontologies/bibframe/Identifier': '@type: http://bibfra.me/vocab/lite/Identifier',
  'http://id.loc.gov/ontologies/bibframe/assigner': 'http://bibfra.me/vocab/marc/assigningSource', // "Review with Gloria'assigner' is of type 'Agent' in bibframe2. However, it is mapped to a litteral field in bibframe lite. Should we create a class 'Agent' in bibframe lite?"
  '@type: http://id.loc.gov/ontologies/bibframe/Ean': '@type: http://bibfra.me/vocab/lite/Ean',
  'http://id.loc.gov/ontologies/bibframe/noteType': '', // TODO:
  'http://www.w3.org/1999/02/22-rdf-syntax-ns#value': {
    'http://id.loc.gov/ontologies/bibframe/Lccn': 'http://bibfra.me/vocab/marc/lccn',
    'http://id.loc.gov/ontologies/bibframe/Isbn': 'http://bibfra.me/vocab/marc/isbn',
    'http://id.loc.gov/ontologies/bibframe/Identifier': 'http://bibfra.me/vocab/marc/otherIdentifier',
    'http://id.loc.gov/ontologies/bibframe/Local': 'http://bibfra.me/vocab/marc/localIdentifier',
    'http://id.loc.gov/ontologies/bibframe/Ean': 'http://bibfra.me/vocab/marc/ean',
    'http://id.loc.gov/ontologies/bibframe/supplementaryContent': '', // TODO:
    'http://id.loc.gov/ontologies/bibframe/electronicLocator': 'http://bibfra.me/vocab/lite/link',
  },
};
