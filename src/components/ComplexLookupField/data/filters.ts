import {
  FiltersGroupCheckType,
  FiltersType,
  SearchLimiterNamesAuthority,
  References,
} from '@common/constants/search.constants';

export const filters = [
  {
    labelId: 'marva.authoritySource',
    type: FiltersGroupCheckType.Lookup,
    source: { uri: '' },
  },
  {
    labelId: 'marva.references',
    type: FiltersGroupCheckType.Multi,
    children: [
      {
        id: References.ExcludeSeeFrom,
        type: FiltersType.Checkbox,
        name: SearchLimiterNamesAuthority.AuthoritySource,
        labelId: 'marva.excludeSeeFrom',
      },
      {
        id: References.ExcludeSeeFromAlso,
        type: FiltersType.Checkbox,
        name: SearchLimiterNamesAuthority.AuthoritySource,
        labelId: 'marva.excludeSeeFromAlso',
      },
    ],
  },
  {
    labelId: 'marva.thesaurus',
    type: FiltersGroupCheckType.Lookup,
    source: { uri: '' },
  },
  {
    labelId: 'marva.typeOfHeading',
    type: FiltersGroupCheckType.Lookup,
    source: { uri: '' },
  },
  {
    labelId: 'marva.dateCreated',
    type: FiltersGroupCheckType.DateRange,
  },
  {
    labelId: 'marva.dateUpdated',
    type: FiltersGroupCheckType.DateRange,
  },
];
