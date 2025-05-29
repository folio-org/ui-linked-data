export interface SimpleFieldResult {
  'http://bibfra.me/vocab/lite/link': string[];
  'http://bibfra.me/vocab/lite/label': string[];
}

export interface ExtendedFieldResult extends SimpleFieldResult {
  'http://bibfra.me/vocab/lite/name': string[];
  'http://bibfra.me/vocab/marc/code': string[];
}

export interface ProcessorResult {
  [key: string]: string[] | SimpleFieldResult[] | ExtendedFieldResult[] | ProcessorResult | ProcessorResult[];
}
