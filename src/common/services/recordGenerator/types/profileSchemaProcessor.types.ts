import { BFLITE_URIS } from "@common/constants/bibframeMapping.constants";

export interface SimpleFieldResult {
  [BFLITE_URIS.LINK]: string[];
  [BFLITE_URIS.LABEL]: string[];
}

export interface ExtendedFieldResult extends SimpleFieldResult {
  [BFLITE_URIS.NAME]: string[];
  [BFLITE_URIS.CODE]: string[];
}

export interface ProcessorResult {
  [key: string]: string[] | SimpleFieldResult[] | ExtendedFieldResult[] | ProcessorResult | ProcessorResult[];
}
