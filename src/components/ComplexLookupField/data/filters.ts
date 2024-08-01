import {
  FiltersGroupCheckType,
  AuthorityType,
  FiltersType,
  SearchLimiterNamesAuthority,
  SourceType,
} from '@common/constants/search.constants';

export const filters = [
  {
    labelId: 'marva.authorityType',
    type: FiltersGroupCheckType.Single,
    children: [
      {
        id: AuthorityType.All,
        type: FiltersType.Radio,
        name: SearchLimiterNamesAuthority.AuthorityType,
        labelId: 'marva.all',
      },
      {
        id: AuthorityType.Pesron,
        type: FiltersType.Radio,
        name: SearchLimiterNamesAuthority.AuthorityType,
        labelId: 'marva.person',
      },
      {
        id: AuthorityType.Family,
        type: FiltersType.Radio,
        name: SearchLimiterNamesAuthority.AuthorityType,
        labelId: 'marva.family',
      },
      {
        id: AuthorityType.CorporateBody,
        type: FiltersType.Radio,
        name: SearchLimiterNamesAuthority.AuthorityType,
        labelId: 'marva.corporateBody',
      },
      {
        id: AuthorityType.Jurisdiction,
        type: FiltersType.Radio,
        name: SearchLimiterNamesAuthority.AuthorityType,
        labelId: 'marva.jurisdiction',
      },
      {
        id: AuthorityType.Conference,
        type: FiltersType.Radio,
        name: SearchLimiterNamesAuthority.AuthorityType,
        labelId: 'marva.conference',
      },
    ],
  },
  {
    labelId: 'marva.source',
    type: FiltersGroupCheckType.Single,
    children: [
      {
        id: SourceType.All,
        type: FiltersType.Radio,
        name: SearchLimiterNamesAuthority.Source,
        labelId: 'marva.all',
      },
      {
        id: SourceType.Authorized,
        type: FiltersType.Radio,
        name: SearchLimiterNamesAuthority.Source,
        labelId: 'marva.authorized',
      },
      {
        id: SourceType.Unauthorized,
        type: FiltersType.Radio,
        name: SearchLimiterNamesAuthority.Source,
        labelId: 'marva.unauthorized',
      },
    ],
  },
];
