import { ItemSearch } from '@components/ItemSearch';
import { SearchResultList } from '@components/SearchResultList';
import {
  FiltersGroupCheckType,
  PublishDate,
  FiltersType,
  SearchLimiterNames,
  Format,
  Suppressed,
  DEFAULT_SEARCH_BY,
} from '@common/constants/search.constants';
import './Search.scss';

const filters = [
  {
    labelId: 'marva.publishDate',
    type: FiltersGroupCheckType.Single,
    children: [
      {
        id: PublishDate.AllTime,
        type: FiltersType.Radio,
        name: SearchLimiterNames.PublishDate,
        labelId: 'marva.allTime',
      },
      {
        id: PublishDate.TwelveMonths,
        type: FiltersType.Radio,
        name: SearchLimiterNames.PublishDate,
        labelId: 'marva.past12Months',
      },
      {
        id: PublishDate.FiveYears,
        type: FiltersType.Radio,
        name: SearchLimiterNames.PublishDate,
        labelId: 'marva.past5Yrs',
      },
      {
        id: PublishDate.TenYears,
        type: FiltersType.Radio,
        name: SearchLimiterNames.PublishDate,
        labelId: 'marva.past10Yrs',
      },
    ],
  },
  {
    labelId: 'marva.format',
    type: FiltersGroupCheckType.Multi,
    children: [
      {
        id: Format.Volume,
        type: FiltersType.Checkbox,
        name: SearchLimiterNames.Format,
        labelId: 'marva.volume',
      },
      {
        id: Format.Ebook,
        type: FiltersType.Checkbox,
        name: SearchLimiterNames.Format,
        labelId: 'marva.onlineResource',
      },
    ],
  },
  {
    labelId: 'marva.suppressed',
    type: FiltersGroupCheckType.Single,
    children: [
      {
        id: Suppressed.All,
        type: FiltersType.Radio,
        name: SearchLimiterNames.Suppressed,
        labelId: 'marva.volume',
      },
      {
        id: Suppressed.NotSuppressed,
        type: FiltersType.Radio,
        name: SearchLimiterNames.Suppressed,
        labelId: 'marva.suppressed',
      },
    ],
  },
];

export const Search = () => {
  return (
    <div className="search" data-testid="search" id="ld-search-container">
      <ItemSearch
        filters={filters}
        hasSearchParams={true}
        defaultSearchBy={DEFAULT_SEARCH_BY}
        searchResultsListComponent={<SearchResultList />}
      />
    </div>
  );
};
