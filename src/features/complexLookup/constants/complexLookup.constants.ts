export enum ComplexLookupType {
  Authorities = 'authorities',
  AuthoritiesSubject = 'authoritiesSubject',
  Hub = 'hub',
}

export const COMPLEX_LOOKUPS_LINKED_FIELDS_MAPPING = {
  subclass: {
    PERSON: {
      uriBFLite: 'http://bibfra.me/vocab/lite/Person',
      labelId: 'ld.person',
    },
    FAMILY: {
      uriBFLite: 'http://bibfra.me/vocab/lite/Family',
      labelId: 'ld.family',
    },
    ORGANIZATION: {
      uriBFLite: 'http://bibfra.me/vocab/lite/Organization',
      labelId: 'ld.organization',
    },
    MEETING: {
      uriBFLite: 'http://bibfra.me/vocab/lite/Meeting',
      labelId: 'ld.meeting',
    },
    JURISDICTION: {
      uriBFLite: 'http://bibfra.me/vocab/lite/Jurisdiction',
      labelId: 'ld.jurisdiction',
    },
  },
};

export const EMPTY_LINKED_DROPDOWN_OPTION_SUFFIX = 'empty';
export const VALUE_DIVIDER = ' ,';

export const LOOKUP_TYPES = {
  AUTHORITIES: 'authorities',
  HUBS: 'hubs',
} as const;

export const SOURCE_TYPES = {
  LOCAL: 'local',
  LIBRARY_OF_CONGRESS: 'libraryOfCongress',
} as const;

export enum Authority {
  Creator = 'creator',
  Subject = 'subject',
}

export enum AuthorityValidationTarget {
  CreatorOfWork = 'CREATOR_OF_WORK',
  SubjectOfWork = 'SUBJECT_OF_WORK',
}
