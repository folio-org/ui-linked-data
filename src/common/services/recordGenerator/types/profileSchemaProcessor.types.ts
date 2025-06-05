import { BFLITE_URIS } from '@common/constants/bibframeMapping.constants';

type SimplePropertyKeys = typeof BFLITE_URIS.LINK | typeof BFLITE_URIS.LABEL;
type ExtendedPropertyKeys = SimplePropertyKeys | typeof BFLITE_URIS.NAME | typeof BFLITE_URIS.CODE;

export type SimplePropertyResult = Record<SimplePropertyKeys, string[]>;

export type ExtendedPropertyResult = Record<ExtendedPropertyKeys, string[]>;

export interface ProcessorResult {
  [key: string]: string[] | SimplePropertyResult[] | ExtendedPropertyResult[] | ProcessorResult | ProcessorResult[];
}
