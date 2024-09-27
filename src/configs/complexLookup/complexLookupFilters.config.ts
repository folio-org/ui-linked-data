import { ComplexLookupType } from '@common/constants/complexLookup.constants';
import {
  FiltersGroupCheckType,
  FiltersType,
  SearchLimiterNamesAuthority,
  References,
} from '@common/constants/search.constants';

const EXCLUDED_AUTHORITY_SOURCE_OPTIONS = ['191874a0-707a-4634-928e-374ee9103225'];

export const COMPLEX_LOOKUP_FILTERS_CONFIG = {
  [ComplexLookupType.Authorities]: [
    {
      id: 'authoritySource',
      labelId: 'marva.authoritySource',
      type: FiltersGroupCheckType.Lookup,
      facet: SearchLimiterNamesAuthority.AuthoritySource,
      isOpen: true,
      hasExternalDataSource: true,
      hasMappedSourceData: true,
      excludedOptions: EXCLUDED_AUTHORITY_SOURCE_OPTIONS,
    },
    {
      id: 'references',
      labelId: 'marva.references',
      type: FiltersGroupCheckType.Multi,
      children: [
        {
          id: References.ExcludeSeeFrom,
          type: FiltersType.Checkbox,
          name: SearchLimiterNamesAuthority.References,
          labelId: 'marva.excludeSeeFrom',
        },
        {
          id: References.ExcludeSeeFromAlso,
          type: FiltersType.Checkbox,
          name: SearchLimiterNamesAuthority.References,
          labelId: 'marva.excludeSeeFromAlso',
        },
      ],
    },
    {
      id: 'thesaurus',
      labelId: 'marva.thesaurus',
      type: FiltersGroupCheckType.Lookup,
      facet: SearchLimiterNamesAuthority.Thesaurus,
      hasExternalDataSource: true,
    },
    {
      id: 'typeOfHeading',
      labelId: 'marva.typeOfHeading',
      type: FiltersGroupCheckType.Lookup,
      facet: SearchLimiterNamesAuthority.TypeOfHeading,
      hasExternalDataSource: true,
    },
    {
      id: 'dateCreated',
      labelId: 'marva.dateCreated',
      type: FiltersGroupCheckType.DateRange,
      facet: SearchLimiterNamesAuthority.DateCreated,
    },
    {
      id: 'dateUpdated',
      labelId: 'marva.dateUpdated',
      type: FiltersGroupCheckType.DateRange,
      facet: SearchLimiterNamesAuthority.DateUpdated,
    },
  ],
};
