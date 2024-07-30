import { FC, memo } from 'react';
import { SEARCH_API_ENDPOINT } from '@common/constants/api.constants';
import {
  AuthorityType,
  FiltersGroupCheckType,
  FiltersType,
  SearchLimiterNamesAuthority,
  SourceType,
} from '@common/constants/search.constants';
import { Modal } from '@components/Modal';
import { Search } from '@components/Search';
import { SearchControlPane } from '@components/SearchControlPane';
import './ModalComplexLookup.scss';

const filters = [
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
interface Props {
  isOpen: boolean;
  onClose: VoidFunction;
  title?: string;
  searchPaneTitle?: string;
}

export const ModalComplexLookup: FC<Props> = memo(({ isOpen, onClose, title = '', searchPaneTitle = '' }) => {
  return (
    <Modal
      isOpen={isOpen}
      title={title}
      onClose={onClose}
      titleClassName="modal-complex-lookup-title"
      showModalControls={false}
      className="modal-complex-lookup"
      classNameHeader="modal-complex-lookup-header"
    >
      <div className="complex-lookup-search-contents" data-testid="complex-lookup-search-contents">
        <Search
          // TODO: Extend the profile with the endpoint and use it here
          endpointUrl={`${SEARCH_API_ENDPOINT}/authorities`}
          isSortedResults={false}
          filters={filters}
          hasSearchParams={false}
          defaultSearchBy={'label' as SearchIdentifiers}
          controlPaneComponent={<SearchControlPane label={searchPaneTitle} />}
          // TODO: create a component
          resultsListComponent={<div />}
          isVisibleFilters={true}
          isVisibleFullDisplay={false}
          isVisibleAdvancedSearch={false}
          isVisibleSearchByControl={false}
          labelEmptySearch="marva.searchNoComplexLookupsMatch"
          classNameEmptyPlaceholder="complex-lookup-search-empty"
        />
      </div>
    </Modal>
  );
});
