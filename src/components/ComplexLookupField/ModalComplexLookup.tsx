import { FC, memo, useCallback, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { IS_EMBEDDED_MODE } from '@common/constants/build.constants';
import { SEARCH_FILTERS_ENABLED } from '@common/constants/feature.constants';
import { COMPLEX_LOOKUPS_CONFIG } from '@common/constants/complexLookup.constants';
import { Modal } from '@components/Modal';
import { Search } from '@components/Search';
import { SearchControlPane } from '@components/SearchControlPane';
import { filters } from './data/filters';
import { ComplexLookupSearchResults } from './ComplexLookupSearchResults';
import './ModalComplexLookup.scss';
import state from '@state';

interface ModalComplexLookupProps {
  isOpen: boolean;
  onAssign: ({ id, title, linkedFieldValue }: ComplexLookupAssignRecordDTO) => void;
  onClose: VoidFunction;
  assignEntityName?: string;
  baseLabelType?: string;
}

export const ModalComplexLookup: FC<ModalComplexLookupProps> = memo(
  ({ isOpen, onAssign, onClose, assignEntityName = 'authorities', baseLabelType = 'creator' }) => {
    const { api, labels, searchBy } = COMPLEX_LOOKUPS_CONFIG[assignEntityName];
    const searchResultsMetadata = useRecoilValue(state.search.pageMetadata);
    const searchControlsSubLabel = useMemo(
      () =>
        searchResultsMetadata?.totalElements ? (
          <FormattedMessage
            id={'marva.recordsFound'}
            values={{
              recordsCount: <span data-testid="records-found-count">{searchResultsMetadata?.totalElements}</span>,
            }}
          />
        ) : undefined,
      [searchResultsMetadata?.totalElements],
    );

    const renderSearchControlPane = useCallback(
      () => (
        <SearchControlPane
          label={<FormattedMessage id={labels.modal.searchResults} />}
          subLabel={searchControlsSubLabel}
        />
      ),
      [labels.modal.searchResults, searchControlsSubLabel],
    );
    const renderResultsList = useCallback(() => <ComplexLookupSearchResults onAssign={onAssign} />, [onAssign]);

    return (
      <Modal
        isOpen={isOpen}
        title={<FormattedMessage id={labels.modal.title[baseLabelType]} />}
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
            endpointUrl={api.endpoint}
            searchFilter={api.searchQuery.filter}
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
