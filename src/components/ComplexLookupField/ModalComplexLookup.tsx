import { FC, memo, useCallback } from 'react';
import classNames from 'classnames';
import { SEARCH_API_ENDPOINT } from '@common/constants/api.constants';
import { IS_EMBEDDED_MODE } from '@common/constants/build.constants';
import { SEARCH_FILTERS_ENABLED } from '@common/constants/feature.constants';
import { Modal } from '@components/Modal';
import { Search } from '@components/Search';
import { SearchControlPane } from '@components/SearchControlPane';
import { filters } from './data/filters';
import { ComplexLookupSearchResults } from './ComplexLookupSearchResults';
import './ModalComplexLookup.scss';

interface ModalComplexLookupProps {
  isOpen: boolean;
  onClose: VoidFunction;
  title?: string;
  searchPaneTitle?: string;
}

export const ModalComplexLookup: FC<ModalComplexLookupProps> = memo(
  ({ isOpen, onClose, title = '', searchPaneTitle = '' }) => {
    const renderSearchControlPane = useCallback(() => <SearchControlPane label={searchPaneTitle} />, [searchPaneTitle]);
    const renderResultsList = useCallback(() => <ComplexLookupSearchResults onAssign={onClose} />, []);

    return (
      <Modal
        isOpen={isOpen}
        title={title}
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
            // TODO: Extend the profile with the endpoint and use it here
            endpointUrl={`${SEARCH_API_ENDPOINT}/authorities`}
            isSortedResults={false}
            filters={filters}
            hasSearchParams={false}
            defaultSearchBy={'label' as SearchIdentifiers}
            renderSearchControlPane={renderSearchControlPane}
            renderResultsList={renderResultsList}
            isVisibleFilters={SEARCH_FILTERS_ENABLED}
            isVisibleFullDisplay={false}
            isVisibleAdvancedSearch={false}
            isVisibleSearchByControl={false}
            labelEmptySearch="marva.enterSearchCriteria"
            classNameEmptyPlaceholder="complex-lookup-search-empty"
          />
        </div>
      </Modal>
    );
  },
);
