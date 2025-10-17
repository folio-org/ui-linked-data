import { FC, memo, useCallback, useEffect } from 'react';
import classNames from 'classnames';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { getSearchResults } from '@common/api/search.api';
import { SEARCH_RESULTS_FORMATTER } from '@common/helpers/search/formatters';
import { SEARCH_QUERY_BUILDER } from '@common/helpers/search/queryBuilder';
import { IS_EMBEDDED_MODE } from '@common/constants/build.constants';
import { Authority, ComplexLookupType } from '@common/constants/complexLookup.constants';
import { useComplexLookupApi } from '@common/hooks/useComplexLookupApi';
import { useMarcData } from '@common/hooks/useMarcData';
import { COMPLEX_LOOKUPS_CONFIG } from '@src/configs';
import { Modal } from '@components/Modal';
import { Search } from '@components/Search';
import { useMarcPreviewState, useSearchState, useUIState } from '@src/store';
import { SearchControlPane } from '@components/SearchControlPane';
import { ComplexLookupSearchResults } from './ComplexLookupSearchResults';
import { MarcPreviewComplexLookup } from './MarcPreviewComplexLookup';
import { SEARCH_RESULTS_TABLE_CONFIG } from './configs';
import './ModalComplexLookup.scss';

interface ModalComplexLookupProps {
  isOpen: boolean;
  onAssign: ({ id, title, linkedFieldValue, uri }: ComplexLookupAssignRecordDTO) => void;
  onClose: VoidFunction;
  value?: string;
  assignEntityName?: string;
  baseLabelType?: string;
}

export const ModalComplexLookup: FC<ModalComplexLookupProps> = memo(
  ({
    isOpen,
    onAssign,
    onClose,
    value,
    assignEntityName = ComplexLookupType.Authorities,
    baseLabelType = Authority.Creator,
  }) => {
    const {
      api,
      segments,
      labels,
      searchBy,
      searchableIndicesMap,
      filters = [],
      buildSearchQuery: buildSearchQueryRef,
      common,
    } = COMPLEX_LOOKUPS_CONFIG[assignEntityName];
    const tableConfig = SEARCH_RESULTS_TABLE_CONFIG[assignEntityName] || SEARCH_RESULTS_TABLE_CONFIG.default;
    const searchResultsFormatter = SEARCH_RESULTS_FORMATTER[assignEntityName] || SEARCH_RESULTS_FORMATTER.default;
    const buildSearchQuery =
      SEARCH_QUERY_BUILDER[buildSearchQueryRef || assignEntityName] || SEARCH_QUERY_BUILDER.default;

    const { setQuery: setSearchQuery, resetQuery: clearSearchQuery } = useSearchState(['setQuery', 'resetQuery']);
    const { getFacetsData, getSourceData } = useComplexLookupApi(api, filters);
    const { setIsMarcPreviewOpen } = useUIState(['setIsMarcPreviewOpen']);
    const {
      setComplexValue,
      resetComplexValue: resetMarcPreviewValue,
      setMetadata: setMarcMetadata,
      resetMetadata: clearMarcMetadata,
    } = useMarcPreviewState(['setComplexValue', 'resetComplexValue', 'setMetadata', 'resetMetadata']);
    const { fetchMarcData } = useMarcData(setComplexValue);

    useEffect(() => {
      if (!value) {
        clearSearchQuery();
        return;
      }

      setSearchQuery(value);
    }, [value]);

    const onCloseMarcPreview = () => {
      setIsMarcPreviewOpen(false);
    };

    const onCloseModal = () => {
      onCloseMarcPreview();
      resetMarcPreviewValue();
      clearMarcMetadata();
      onClose();
    };

    const renderSearchControlsSubLabel = (totalElements: number) => (
      <FormattedMessage
        id={'ld.recordsFound'}
        values={{
          recordsCount: <FormattedNumber value={totalElements} data-testid="records-found-count" />,
        }}
      />
    );

    const renderSearchControlPane = useCallback(
      () => (
        <SearchControlPane
          label={<FormattedMessage id={labels.modal.searchResults} />}
          renderSubLabel={renderSearchControlsSubLabel}
          segmentsConfig={segments?.primary}
        />
      ),
      [labels.modal.searchResults],
    );

    const loadMarcData = useCallback(
      async (id: string, title?: string, headingType?: string) => {
        const marcData = await fetchMarcData(id, api.endpoints.marcPreview);

        if (marcData && title && headingType) {
          setMarcMetadata({ baseId: id, marcId: marcData.id, srsId: marcData.matchedId, title, headingType });
          setIsMarcPreviewOpen(true);
        }
      },
      [api.endpoints.marcPreview],
    );

    const renderResultsList = useCallback(
      () => (
        <ComplexLookupSearchResults
          onTitleClick={loadMarcData}
          tableConfig={tableConfig}
          searchResultsFormatter={searchResultsFormatter}
        />
      ),
      [loadMarcData, tableConfig, searchResultsFormatter],
    );

    const renderMarcPreview = useCallback(() => <MarcPreviewComplexLookup onClose={onCloseMarcPreview} />, []);

    return (
      <Modal
        isOpen={isOpen}
        title={<FormattedMessage id={labels.modal.title[baseLabelType]} />}
        onClose={onCloseModal}
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
            sameOrigin={api.endpoints.sameOrigin}
            endpointUrlsBySegments={api.endpoints.bySearchSegment}
            primarySegments={segments?.primary}
            searchFilter={api.searchQuery.filter}
            isSortedResults={false}
            filters={filters}
            hasSearchParams={false}
            defaultNavigationSegment={segments?.defaultValues?.segment}
            defaultSearchBy={segments?.defaultValues?.searchBy ?? searchBy?.defaultValue}
            defaultQuery={value}
            renderSearchControlPane={renderSearchControlPane}
            renderResultsList={renderResultsList}
            renderMarcPreview={renderMarcPreview}
            isVisibleFilters={false}
            isVisibleFullDisplay={false}
            isVisibleAdvancedSearch={false}
            isVisibleSearchByControl={true}
            isVisibleSegments={!!segments}
            common={common}
            hasMarcPreview={true}
            hasCustomPagination={true}
            searchByControlOptions={searchBy.config}
            searchableIndicesMap={searchableIndicesMap}
            labelEmptySearch={labels.modal.emptySearch ?? 'ld.chooseFilterOrEnterSearchQuery'}
            classNameEmptyPlaceholder="complex-lookup-search-empty"
            getSearchSourceData={getSourceData}
            getSearchFacetsData={getFacetsData}
            fetchSearchResults={getSearchResults}
            buildSearchQuery={buildSearchQuery}
            searchResultsLimit={api.searchQuery.limit}
            precedingRecordsCount={api.searchQuery.precedingRecordsCount}
            searchResults={api.results}
            onAssignRecord={onAssign}
          />
        </div>
      </Modal>
    );
  },
);
