import { BFLITE_URIS } from '@common/constants/bibframeMapping.constants';

type SimpleFieldKeys = typeof BFLITE_URIS.LINK | typeof BFLITE_URIS.LABEL;
type ExtendedFieldKeys = SimpleFieldKeys | typeof BFLITE_URIS.NAME | typeof BFLITE_URIS.CODE;

export type SimpleFieldResult = Record<SimpleFieldKeys, string[]>;

export type ExtendedFieldResult = Record<ExtendedFieldKeys, string[]>;

export interface ProcessorResult {
  [key: string]: string[] | SimpleFieldResult[] | ExtendedFieldResult[] | ProcessorResult | ProcessorResult[];
}
