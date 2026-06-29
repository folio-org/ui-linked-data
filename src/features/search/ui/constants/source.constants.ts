import { SourceOption } from '../types';

export const SOURCE_OPTIONS: SourceOption[] = [
  {
    value: 'libraryOfCongress',
    labelId: 'ld.source.libraryOfCongress',
  },
  {
    value: 'local',
    labelId: 'ld.source.local',
  },
];

export const AUTHORITIES_SOURCE_OPTIONS: SourceOption[] = [
  {
    value: 'ld',
    labelId: 'ld.source.localLDAuthority',
  },
  {
    value: 'marc',
    labelId: 'ld.source.localMarcAuthority',
  },
  {
    value: 'locChildren',
    labelId: 'ld.source.locChildrensSubject',
  },
];
