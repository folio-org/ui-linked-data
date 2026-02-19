import { SOURCE_TYPES } from '@/common/constants/lookup.constants';

export type SourceType = (typeof SOURCE_TYPES)[keyof typeof SOURCE_TYPES];
