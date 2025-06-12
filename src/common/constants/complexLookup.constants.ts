export enum ComplexLookupType {
  Authorities = 'authorities',
}

export enum SearchableIndex {
  Keyword = 'keyword',
  Identifier = 'identifier',
  LCCN = 'lccn',
  PersonalName = 'personalName',
  CorporateConferenceName = 'corporateConferenceName',
  GeographicName = 'geographicName',
  NameTitle = 'nameTitle',
  UniformTitle = 'uniformTitle',
  Subject = 'subject',
  ChildrenSubjectHeading = 'childrenSubjectHeading',
  Genre = 'genre',
}

export enum SearchableIndexQuerySelector {
  Query = 'query',
  Prev = 'prev',
  Next = 'next',
}

export const COMPLEX_LOOKUPS_LINKED_FIELDS_MAPPING = {
  subclass: {
    PERSON: {
      bfLiteUri: 'http://bibfra.me/vocab/lite/Person',
      labelId: 'ld.person',
    },
    FAMILY: {
      bfLiteUri: 'http://bibfra.me/vocab/lite/Family',
      labelId: 'ld.family',
    },
    ORGANIZATION: {
      bfLiteUri: 'http://bibfra.me/vocab/lite/Organization',
      labelId: 'ld.organization',
    },
    MEETING: {
      bfLiteUri: 'http://bibfra.me/vocab/lite/Meeting',
      labelId: 'ld.meeting',
    },
    JURISDICTION: {
      bfLiteUri: 'http://bibfra.me/vocab/lite/Jurisdiction',
      labelId: 'ld.jurisdiction',
    },
  },
};

export const EMPTY_LINKED_DROPDOWN_OPTION_SUFFIX = 'empty';
export const VALUE_DIVIDER = ' ,';
export const __MOCK_URI_CHANGE_WHEN_IMPLEMENTING = '__MOCK_URI_CHANGE_WHEN_IMPLEMENTING';

export enum Authority {
  Creator = 'creator',
}

export enum AuthorityValidationTarget {
  CreatorOfWork = 'CREATOR_OF_WORK',
}
