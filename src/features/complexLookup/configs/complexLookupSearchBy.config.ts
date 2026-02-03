import { SearchSegment } from '@/common/constants/search.constants';
import { SearchableIndex } from '@/common/constants/searchableIndex.constants';

import { ComplexLookupType } from '@/features/complexLookup/constants/complexLookup.constants';

export const COMPLEX_LOOKUP_SEARCH_BY_CONFIG = {
  [ComplexLookupType.Authorities]: {
    [SearchSegment.Search]: [
      {
        label: 'keyword',
        value: SearchableIndex.Keyword,
      },
      {
        label: 'identifierAll',
        value: SearchableIndex.Identifier,
      },
      {
        label: 'lccn',
        value: SearchableIndex.LCCN,
      },
      {
        label: 'personalName',
        value: SearchableIndex.PersonalName,
      },
      {
        label: 'corporateName',
        value: SearchableIndex.CorporateConferenceName,
      },
      {
        label: 'geographicName',
        value: SearchableIndex.GeographicName,
      },
      {
        label: 'nameTitle',
        value: SearchableIndex.NameTitle,
      },
      {
        label: 'uniformTitle',
        value: SearchableIndex.UniformTitle,
      },
      {
        label: 'subject',
        value: SearchableIndex.Subject,
      },
      {
        label: 'childrensSubjectHeading',
        value: SearchableIndex.ChildrenSubjectHeading,
      },
      {
        label: 'genre',
        value: SearchableIndex.Genre,
      },
    ],
    [SearchSegment.Browse]: [
      {
        label: 'selectBrowseOption',
        value: '',
        isDisabled: true,
      },
      {
        label: 'personalName',
        value: SearchableIndex.PersonalName,
      },
      {
        label: 'corporateName',
        value: SearchableIndex.CorporateConferenceName,
      },
      {
        label: 'geographicName',
        value: SearchableIndex.GeographicName,
      },
      {
        label: 'nameTitle',
        value: SearchableIndex.NameTitle,
      },
      {
        label: 'uniformTitle',
        value: SearchableIndex.UniformTitle,
      },
      {
        label: 'subject',
        value: SearchableIndex.Subject,
      },
      {
        label: 'genre',
        value: SearchableIndex.Genre,
      },
    ],
  },
  [ComplexLookupType.Hub]: [
    {
      label: 'search.hubNameLeftAnchored',
      value: SearchableIndex.HubNameLeftAnchored,
      placeholder: 'ld.placeholder.startsWith',
    },
    {
      label: 'search.hubNameKeyword',
      value: SearchableIndex.HubNameKeyword,
      placeholder: '',
    },
  ],
};
