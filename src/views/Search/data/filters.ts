import {
  FiltersGroupCheckType,
  FiltersType,
  Format,
  PublishDate,
  SearchLimiterNames,
  Suppressed,
} from '@/common/constants/search.constants';

export const filters = [
  {
    labelId: 'ld.publishDate',
    type: FiltersGroupCheckType.Single,
    children: [
      {
        id: PublishDate.AllTime,
        type: FiltersType.Radio,
        name: SearchLimiterNames.PublishDate,
        labelId: 'ld.allTime',
      },
      {
        id: PublishDate.TwelveMonths,
        type: FiltersType.Radio,
        name: SearchLimiterNames.PublishDate,
        labelId: 'ld.past12Months',
      },
      {
        id: PublishDate.FiveYears,
        type: FiltersType.Radio,
        name: SearchLimiterNames.PublishDate,
        labelId: 'ld.past5Yrs',
      },
      {
        id: PublishDate.TenYears,
        type: FiltersType.Radio,
        name: SearchLimiterNames.PublishDate,
        labelId: 'ld.past10Yrs',
      },
    ],
  },
  {
    labelId: 'ld.format',
    type: FiltersGroupCheckType.Multi,
    children: [
      {
        id: Format.Volume,
        type: FiltersType.Checkbox,
        name: SearchLimiterNames.Format,
        labelId: 'ld.volume',
      },
      {
        id: Format.Ebook,
        type: FiltersType.Checkbox,
        name: SearchLimiterNames.Format,
        labelId: 'ld.onlineResource',
      },
    ],
  },
  {
    labelId: 'ld.suppressed',
    type: FiltersGroupCheckType.Single,
    children: [
      {
        id: Suppressed.All,
        type: FiltersType.Radio,
        name: SearchLimiterNames.Suppressed,
        labelId: 'ld.volume',
      },
      {
        id: Suppressed.NotSuppressed,
        type: FiltersType.Radio,
        name: SearchLimiterNames.Suppressed,
        labelId: 'ld.suppressed',
      },
    ],
  },
];
