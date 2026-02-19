import { SOURCE_TYPES } from '../constants/complexLookup.constants';

export type SourceType = (typeof SOURCE_TYPES)[keyof typeof SOURCE_TYPES];
