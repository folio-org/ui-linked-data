import { ComplexLookupType } from '@common/constants/complexLookup.constants';
import {
  FiltersGroupCheckType,
  FiltersType,
  SearchLimiterNamesAuthority,
  References,
} from '@common/constants/search.constants';

export const COMPLEX_LOOKUP_FILTERS_CONFIG = {
  [ComplexLookupType.Authorities]: [
    {
      labelId: 'marva.authoritySource',
      type: FiltersGroupCheckType.Lookup,
      facet: SearchLimiterNamesAuthority.AuthoritySource,
      isOpen: true,
      hasExternalDataSource: true,
      hasMappedSourceData: true,
    },
    {
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
      labelId: 'marva.thesaurus',
      type: FiltersGroupCheckType.Lookup,
      facet: SearchLimiterNamesAuthority.Thesaurus,
      hasExternalDataSource: true,
    },
    {
      labelId: 'marva.typeOfHeading',
      type: FiltersGroupCheckType.Lookup,
      facet: SearchLimiterNamesAuthority.TypeOfHeading,
      hasExternalDataSource: true,
    },
    {
      labelId: 'marva.dateCreated',
      type: FiltersGroupCheckType.DateRange,
      facet: SearchLimiterNamesAuthority.DateCreated,
    },
    {
      labelId: 'marva.dateUpdated',
      type: FiltersGroupCheckType.DateRange,
      facet: SearchLimiterNamesAuthority.DateUpdated,
    },
  ],
};
