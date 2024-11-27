import { ComplexLookupType } from '@common/constants/complexLookup.constants';
import {
  FiltersGroupCheckType,
  FiltersType,
  SearchLimiterNamesAuthority,
  References,
} from '@common/constants/search.constants';

// TODO: UILD-439 - add the required identifiers when the way to filter the options list is approved
const EXCLUDED_AUTHORITY_SOURCE_OPTIONS = [] as string[];

export const COMPLEX_LOOKUP_FILTERS_CONFIG = {
  [ComplexLookupType.Authorities]: [
    {
      id: 'authoritySource',
      labelId: 'ld.authoritySource',
      type: FiltersGroupCheckType.Lookup,
      facet: SearchLimiterNamesAuthority.AuthoritySource,
      isOpen: true,
      hasExternalDataSource: true,
      hasMappedSourceData: true,
      excludedOptions: EXCLUDED_AUTHORITY_SOURCE_OPTIONS,
    },
    {
      id: 'references',
      labelId: 'ld.references',
      type: FiltersGroupCheckType.Multi,
      children: [
        {
          id: References.ExcludeSeeFrom,
          type: FiltersType.Checkbox,
          name: SearchLimiterNamesAuthority.References,
          labelId: 'ld.excludeSeeFrom',
        },
        {
          id: References.ExcludeSeeFromAlso,
          type: FiltersType.Checkbox,
          name: SearchLimiterNamesAuthority.References,
          labelId: 'ld.excludeSeeFromAlso',
        },
      ],
    },
    {
      id: 'thesaurus',
      labelId: 'ld.thesaurus',
      type: FiltersGroupCheckType.Lookup,
      facet: SearchLimiterNamesAuthority.Thesaurus,
      hasExternalDataSource: true,
    },
    {
      id: 'typeOfHeading',
      labelId: 'ld.typeOfHeading',
      type: FiltersGroupCheckType.Lookup,
      facet: SearchLimiterNamesAuthority.TypeOfHeading,
      hasExternalDataSource: true,
    },
    {
      id: 'dateCreated',
      labelId: 'ld.dateCreated',
      type: FiltersGroupCheckType.DateRange,
      facet: SearchLimiterNamesAuthority.DateCreated,
    },
    {
      id: 'dateUpdated',
      labelId: 'ld.dateUpdated',
      type: FiltersGroupCheckType.DateRange,
      facet: SearchLimiterNamesAuthority.DateUpdated,
    },
  ],
};
