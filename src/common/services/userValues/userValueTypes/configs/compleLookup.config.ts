export interface ComplexLookupConfig {
  vocabLite: {
    labelUri: string;
    linkUri: string;
  };
  fieldPatterns: {
    nestedValueField: string;
    valueProperty: string;
    preferredProperty: string;
  };
  relationFields: string[];
  labelFallbacks: string[];
  idFields: string[];
}

export const BASE_COMPLEX_LOOKUP_CONFIG: ComplexLookupConfig = {
  vocabLite: {
    labelUri: 'http://bibfra.me/vocab/lite/label',
    linkUri: 'http://bibfra.me/vocab/lite/link',
  },
  fieldPatterns: {
    nestedValueField: '_name',
    valueProperty: 'value',
    preferredProperty: 'isPreferred',
  },
  relationFields: ['_relation', 'relation', 'type', '_type'],
  labelFallbacks: ['label', 'value'],
  idFields: ['id'],
};
