import { ComplexLookupType } from '@common/constants/complexLookup.constants';
import { SearchSegment } from '@common/constants/search.constants';

export const COMPLEX_LOOKUP_SEARCH_BY_CONFIG = {
  [ComplexLookupType.Authorities]: {
    [SearchSegment.Search]: [
      {
        label: 'keyword',
        value: 'label',
      },
      {
        label: 'identifierAll',
        value: 'identifiers.value',
      },
      {
        label: 'lccn',
        value: 'lccn',
      },
      {
        label: 'personalName',
        value: 'personalName',
      },
      {
        label: 'corporateName',
        value: 'corporateName',
      },
      {
        label: 'geographicName',
        value: 'geographicName',
      },
      {
        label: 'nameTitle',
        value: 'nameTitle',
      },
      {
        label: 'uniformTitle',
        value: 'uniformTitle',
      },
      {
        label: 'subject',
        value: 'subject',
      },
      {
        label: 'childrensSubjectHeading',
        value: 'childrensSubjectHeading',
      },
      {
        label: 'genre',
        value: 'genre',
      },
    ],
    [SearchSegment.Browse]: [
      {
        label: 'personalName',
        value: 'personalName',
      },
      {
        label: 'corporateName',
        value: 'corporateName',
      },
      {
        label: 'geographicName',
        value: 'geographicName',
      },
      {
        label: 'nameTitle',
        value: 'nameTitle',
      },
      {
        label: 'uniformTitle',
        value: 'uniformTitle',
      },
      {
        label: 'subject',
        value: 'subject',
      },
      {
        label: 'genre',
        value: 'genre',
      },
    ],
  },
};
