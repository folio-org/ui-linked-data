import { BFLITE_URIS } from '@common/constants/bibframeMapping.constants';

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
    labelUri: BFLITE_URIS.LABEL,
    linkUri: BFLITE_URIS.LINK,
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
