import {
  FiltersGroupCheckType,
  AuthorityType,
  FiltersType,
  SearchLimiterNamesAuthority,
  SourceType,
} from '@common/constants/search.constants';

export const filters = [
  {
    labelId: 'ld.authorityType',
    type: FiltersGroupCheckType.Single,
    children: [
      {
        id: AuthorityType.All,
        type: FiltersType.Radio,
        name: SearchLimiterNamesAuthority.AuthorityType,
        labelId: 'ld.all',
      },
      {
        id: AuthorityType.Pesron,
        type: FiltersType.Radio,
        name: SearchLimiterNamesAuthority.AuthorityType,
        labelId: 'ld.person',
      },
      {
        id: AuthorityType.Family,
        type: FiltersType.Radio,
        name: SearchLimiterNamesAuthority.AuthorityType,
        labelId: 'ld.family',
      },
      {
        id: AuthorityType.CorporateBody,
        type: FiltersType.Radio,
        name: SearchLimiterNamesAuthority.AuthorityType,
        labelId: 'ld.corporateBody',
      },
      {
        id: AuthorityType.Jurisdiction,
        type: FiltersType.Radio,
        name: SearchLimiterNamesAuthority.AuthorityType,
        labelId: 'ld.jurisdiction',
      },
      {
        id: AuthorityType.Conference,
        type: FiltersType.Radio,
        name: SearchLimiterNamesAuthority.AuthorityType,
        labelId: 'ld.conference',
      },
    ],
  },
  {
    labelId: 'ld.source',
    type: FiltersGroupCheckType.Single,
    children: [
      {
        id: SourceType.All,
        type: FiltersType.Radio,
        name: SearchLimiterNamesAuthority.Source,
        labelId: 'ld.all',
      },
      {
        id: SourceType.Authorized,
        type: FiltersType.Radio,
        name: SearchLimiterNamesAuthority.Source,
        labelId: 'ld.authorized',
      },
      {
        id: SourceType.Unauthorized,
        type: FiltersType.Radio,
        name: SearchLimiterNamesAuthority.Source,
        labelId: 'ld.unauthorized',
      },
    ],
  },
];
