import { FC, memo, useCallback } from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { SEARCH_API_ENDPOINT } from '@common/constants/api.constants';
import { IS_EMBEDDED_MODE } from '@common/constants/build.constants';
import { SEARCH_FILTERS_ENABLED } from '@common/constants/feature.constants';
import { COMPLEX_LOOKUPS_CONFIG } from '@common/constants/complexLookup.constants';
import { Modal } from '@components/Modal';
import { Search } from '@components/Search';
import { SearchControlPane } from '@components/SearchControlPane';
import { Row } from '@components/Table';
import { filters } from './data/filters';
import { ComplexLookupSearchResults } from './ComplexLookupSearchResults';
import './ModalComplexLookup.scss';

interface ModalComplexLookupProps {
  isOpen: boolean;
  onAssign: (row: Row) => void;
  onClose: VoidFunction;
  apiEndpoint?: string;
  group?: string;
}

export const ModalComplexLookup: FC<ModalComplexLookupProps> = memo(
  ({ isOpen, onAssign, onClose, apiEndpoint = 'authorities', group = 'creator' }) => {
    const { labels, customFields, searchBy, searchQuery } = COMPLEX_LOOKUPS_CONFIG[apiEndpoint];

    const renderSearchControlPane = useCallback(
      () => <SearchControlPane label={<FormattedMessage id={labels.modal.searchResults} />} />,
      [labels.modal.searchResults],
    );
    const renderResultsList = useCallback(
      () => <ComplexLookupSearchResults sourceLabel={customFields.source.label} onAssign={onAssign} />,
      [customFields.source.label, onAssign],
    );

    return (
      <Modal
        isOpen={isOpen}
        title={<FormattedMessage id={labels.modal.title[group]} />}
        onClose={onClose}
        titleClassName="modal-complex-lookup-title"
        showModalControls={false}
        className={classNames(['modal-complex-lookup', IS_EMBEDDED_MODE && 'modal-complex-lookup-embedded'])}
        classNameHeader={classNames([
          'modal-complex-lookup-header',
          IS_EMBEDDED_MODE && 'modal-complex-lookup-header-embedded',
        ])}
      >
        <div className="complex-lookup-search-contents" data-testid="complex-lookup-search-contents">
          <Search
            endpointUrl={`${SEARCH_API_ENDPOINT}/${apiEndpoint}`}
            searchFilter={searchQuery.filter}
            isSortedResults={false}
            filters={filters}
            hasSearchParams={false}
            defaultSearchBy={searchBy[0].value as unknown as SearchIdentifiers}
            renderSearchControlPane={renderSearchControlPane}
            renderResultsList={renderResultsList}
            isVisibleFilters={SEARCH_FILTERS_ENABLED}
            isVisibleFullDisplay={false}
            isVisibleAdvancedSearch={false}
            isVisibleSearchByControl={true}
            searchByControlOptions={searchBy}
            labelEmptySearch="marva.enterSearchCriteria"
            classNameEmptyPlaceholder="complex-lookup-search-empty"
          />
        </div>
      </Modal>
    );
  },
);
