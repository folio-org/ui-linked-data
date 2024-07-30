import { FormattedMessage } from 'react-intl';
import { Search } from '@components/Search';
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
import { SearchControlPane } from '@components/SearchControlPane';
import { useNavigateToEditPage } from '@common/hooks/useNavigateToEditPage';
import { DropdownItemType } from '@common/constants/uiElements.constants';
import { ROUTES } from '@common/constants/routes.constants';
import { Dropdown } from '@components/Dropdown';
import { ResourceType } from '@common/constants/record.constants';
import { SEARCH_RESOURCE_API_ENDPOINT } from '@common/constants/api.constants';
import { SEARCH_FILTERS_ENABLED } from '@common/constants/feature.constants';
import Plus16 from '@src/assets/plus-16.svg?react';
import Compare from '@src/assets/compare.svg?react';
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

export const SearchView = () => {
  const { navigateToEditPage } = useNavigateToEditPage();

  const items = [
    {
      id: 'actions',
      labelId: 'marva.actions',
      data: [
        {
          id: 'newResource',
          type: DropdownItemType.basic,
          labelId: 'marva.newResource',
          icon: <Plus16 />,
          action: () => {
            navigateToEditPage(`${ROUTES.RESOURCE_CREATE.uri}?type=${ResourceType.work}`);
          },
        },
        {
          id: 'compare',
          type: DropdownItemType.basic,
          labelId: 'marva.compareSelected',
          icon: <Compare />,
          isDisabled: true,
        },
      ],
    },
    // Example of the dropdown option with a custom component instead of the standart button
    /* {
      id: 'sortBy',
      labelId: 'marva.newResource',
      data: [
        {
          id: 'sortBy',
          type: DropdownItemType.customComponent,
          renderComponent: (key: string | number) => <div key={key}>Custom</div>,
        },
      ],
    }, */
  ];

  return (
    <div className="search" data-testid="search" id="ld-search-container">
      <Search
        endpointUrl={SEARCH_RESOURCE_API_ENDPOINT}
        filters={filters}
        hasSearchParams={true}
        defaultSearchBy={DEFAULT_SEARCH_BY}
        labelEmptySearch="marva.enterSearchCriteria"
        controlPaneComponent={
          <SearchControlPane label={<FormattedMessage id="marva.resources" />}>
            <Dropdown labelId="marva.actions" items={items} />
          </SearchControlPane>
        }
        resultsListComponent={<SearchResultList />}
        isVisibleFilters={SEARCH_FILTERS_ENABLED}
        isVisibleFullDisplay={true}
        isVisibleAdvancedSearch={true}
        isVisibleSearchByControl={true}
      />
    </div>
  );
};
