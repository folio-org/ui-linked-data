export const BF2_TO_BFLITE_MAP: BFLiteMap = {
  'http://id.loc.gov/ontologies/bibframe/Instance': 'http://bibfra.me/vocab/lite/Instance',
  'http://id.loc.gov/ontologies/bibframe/title': 'http://bibfra.me/vocab/marc/title',
  'http://id.loc.gov/ontologies/bibframe/Title': 'http://bibfra.me/vocab/marc/Title',
  'http://id.loc.gov/ontologies/bflc/nonSortNum': 'http://bibfra.me/vocab/bflc/nonSortNum',
  'http://id.loc.gov/ontologies/bibframe/mainTitle': 'http://bibfra.me/vocab/marc/mainTitle',
  'http://id.loc.gov/ontologies/bibframe/partNumber': 'http://bibfra.me/vocab/marc/partNumber',
  'http://id.loc.gov/ontologies/bibframe/partName': 'http://bibfra.me/vocab/marc/partName',
  'http://id.loc.gov/ontologies/bibframe/subtitle': 'http://bibfra.me/vocab/marc/subtitle',
  'http://id.loc.gov/ontologies/bibframe/VariantTitle': 'http://bibfra.me/vocab/bf/VariantTitle',
  'http://id.loc.gov/ontologies/bibframe/date': 'http://bibfra.me/vocab/lite/date',
  'http://id.loc.gov/ontologies/bibframe/variantType': 'http://bibfra.me/vocab/marc/variantType',
  'http://id.loc.gov/ontologies/bibframe/ParallelTitle': 'http://bibfra.me/vocab/bf/ParallelTitle',
  'http://id.loc.gov/ontologies/bibframe/note': 'http://bibfra.me/vocab/lite/note',
  'http://id.loc.gov/ontologies/bibframe/responsibilityStatement':
    'http://bibfra.me/vocab/marc/statementOfResponsibility',
  'http://id.loc.gov/ontologies/bibframe/editionStatement': 'http://bibfra.me/vocab/marc/edition',
  'http://id.loc.gov/ontologies/bibframe/provisionActivity': 'https://bibfra.me/vocab/marc/provisionActivity',
  'http://id.loc.gov/ontologies/bibframe/Publication': 'https://bibfra.me/vocab/lite/ProviderEvent',
  'http://id.loc.gov/ontologies/bibframe/place': 'https://bibfra.me/vocab/lite/providerPlace',
  'http://id.loc.gov/ontologies/bflc/simplePlace': 'https://bibfra.me/vocab/lite/simplePlace',
  'http://id.loc.gov/ontologies/bflc/simpleAgent': 'http://bibfra.me/vocab/lite/providerAgent',
  'http://id.loc.gov/ontologies/bflc/simpleDate': 'http://bibfra.me/vocab/lite/date',
  'http://id.loc.gov/ontologies/bibframe/Distribution': 'http://bibfra.me/vocab/marc/DistributionEvent',
  'http://id.loc.gov/ontologies/bibframe/Manufacture': 'http://bibfra.me/vocab/marc/ManufactureEvent',
  'http://id.loc.gov/ontologies/bibframe/Production': 'http://bibfra.me/vocab/marc/ProductionEvent',
  'http://www.w3.org/2000/01/rdf-schema#label': {
    'http://id.loc.gov/ontologies/bibframe/note': 'http://bibfra.me/vocab/lite/note',
  },
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

// TODO: remove mocked data
export const BFLITE_RECORD_EXAMPLE = {
  type: 'http://bibfra.me/vocab/marc/Monograph',
  'http://bibfra.me/vocab/lite/Instance': [
    {
      'http://bibfra.me/vocab/bf/title': [
        {
          'http://bibfra.me/vocab/marc/Title': {
            'http://bibfra.me/vocab/marc/partName': ['Instance: partName'],
            'http://bibfra.me/vocab/marc/partNumber': ['Instance: partNumber'],
            'http://bibfra.me/vocab/marc/mainTitle': ['Instance: Laramie holds the range'],
            'http://bibfra.me/vocab/bflc/nonSortNum': ['Instance: nonSortNum'],
            'http://bibfra.me/vocab/marc/subTitle': ['Instance: subtitle'],
          },
        },
        {
          'http://bibfra.me/vocab/marc/ParallelTitle': {
            'http://bibfra.me/vocab/marc/partName': ['Parallel: partName'],
            'http://bibfra.me/vocab/marc/partNumber': ['Parallel: partNumber'],
            'http://bibfra.me/vocab/marc/mainTitle': ['Parallel: Laramie holds the range'],
            'http://bibfra.me/vocab/lite/note': ['Parallel: noteLabel'],
            'http://bibfra.me/vocab/lite/date': ['Parallel: date'],
            'http://bibfra.me/vocab/marc/subTitle': ['Parallel: subtitle'],
          },
        },
        {
          'http://bibfra.me/vocab/marc/VariantTitle': {
            'http://bibfra.me/vocab/marc/partName': ['Variant: partName'],
            'http://bibfra.me/vocab/marc/partNumber': ['Variant: partNumber'],
            'http://bibfra.me/vocab/marc/mainTitle': ['Variant: Laramie holds the range'],
            'http://bibfra.me/vocab/lite/note': ['Variant: noteLabel'],
            'http://bibfra.me/vocab/lite/date': ['Variant: date'],
            'http://bibfra.me/vocab/marc/subTitle': ['Variant: subtitle'],
            'http://bibfra.me/vocab/marc/variantType': ['Variant: variantType'],
          },
        },
      ],
      'http://bibfra.me/vocab/marc/mediaType': ['unmediated'],
      'http://bibfra.me/vocab/marc/carrier': ['carrier'],
      'http://bibfra.me/vocab/lite/dimensions': ['20 cm'],
      'http://bibfra.me/vocab/marc/statementOfResponsibility': ['responsibility statement'],
      'http://bibfra.me/vocab/marc/edition': ['edition statement'],
      'http://bibfra.me/vocab/lite/copyrightDate': ['copyright date'],
      'http://bibfra.me/vocab/marc/projectedProvisionDate': ['projected provision date'],
    },
  ],
};
