import { FC, memo, useCallback, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { getSearchResults } from '@common/api/search.api';
import { SEARCH_RESULTS_FORMATTER } from '@common/helpers/search/formatters';
import { IS_EMBEDDED_MODE } from '@common/constants/build.constants';
import { SearchSegment } from '@common/constants/search.constants';
import { ComplexLookupType } from '@common/constants/complexLookup.constants';
import { useComplexLookupApi } from '@common/hooks/useComplexLookupApi';
import { COMPLEX_LOOKUPS_CONFIG } from '@src/configs';
import { Modal } from '@components/Modal';
import { Search } from '@components/Search';
import { SearchControlPane } from '@components/SearchControlPane';
import state from '@state';
import { ComplexLookupSearchResults } from './ComplexLookupSearchResults';
import { SEARCH_RESULTS_TABLE_CONFIG } from './configs';
import './ModalComplexLookup.scss';

interface ModalComplexLookupProps {
  isOpen: boolean;
  onAssign: ({ id, title, linkedFieldValue }: ComplexLookupAssignRecordDTO) => void;
  onClose: VoidFunction;
  assignEntityName?: string;
  baseLabelType?: string;
}

export const ModalComplexLookup: FC<ModalComplexLookupProps> = memo(
  ({ isOpen, onAssign, onClose, assignEntityName = ComplexLookupType.Authorities, baseLabelType = 'creator' }) => {
    const { api, segments, labels, searchBy, filters = [] } = COMPLEX_LOOKUPS_CONFIG[assignEntityName];
    const tableConfig = SEARCH_RESULTS_TABLE_CONFIG[assignEntityName] || SEARCH_RESULTS_TABLE_CONFIG.default;
    const searchResultsFormatter = SEARCH_RESULTS_FORMATTER[assignEntityName] || SEARCH_RESULTS_FORMATTER.default;

    const searchResultsMetadata = useRecoilValue(state.search.pageMetadata);
    const { getFacetsData, getSourceData } = useComplexLookupApi(api, filters, isOpen);

    const searchControlsSubLabel = useMemo(
      () =>
        searchResultsMetadata?.totalElements ? (
          <FormattedMessage
            id={'ld.recordsFound'}
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

    const renderResultsList = useCallback(
      () => (
        <ComplexLookupSearchResults
          onAssign={onAssign}
          tableConfig={tableConfig}
          searchResultsFormatter={searchResultsFormatter}
        />
      ),
      [onAssign, tableConfig, searchResultsFormatter],
    );

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
            endpointUrl={api.endpoints.base}
            endpointUrlsBySegments={api.endpoints.bySearchSegment}
            primarySegments={segments?.primary}
            searchFilter={api.searchQuery.filter}
            isSortedResults={false}
            filters={filters}
            hasSearchParams={false}
            defaultNavigationSegment={SearchSegment.Search}
            defaultSearchBy={searchBy[SearchSegment.Search]?.[0].value as unknown as SearchIdentifiers}
            renderSearchControlPane={renderSearchControlPane}
            renderResultsList={renderResultsList}
            isVisibleFilters={true}
            isVisibleFullDisplay={false}
            isVisibleAdvancedSearch={false}
            isVisibleSearchByControl={true}
            isVisibleSegments={true}
            hasMultilineSearchInput={true}
            searchByControlOptions={searchBy}
            labelEmptySearch="ld.chooseFilterOrEnterSearchQuery"
            classNameEmptyPlaceholder="complex-lookup-search-empty"
            getSearchSourceData={getSourceData}
            getSearchFacetsData={getFacetsData}
            fetchSearchResults={getSearchResults}
            searchResultsLimit={api.searchQuery.limit}
          />
        </div>
      </Modal>
    );
  },
);
