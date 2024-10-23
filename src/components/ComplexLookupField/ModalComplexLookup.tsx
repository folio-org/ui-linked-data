import { FC, memo, useCallback, useEffect } from 'react';
import { useResetRecoilState, useSetRecoilState } from 'recoil';
import classNames from 'classnames';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { getSearchResults } from '@common/api/search.api';
import { SEARCH_RESULTS_FORMATTER } from '@common/helpers/search/formatters';
import { IS_EMBEDDED_MODE } from '@common/constants/build.constants';
import { SearchSegment } from '@common/constants/search.constants';
import { ComplexLookupType } from '@common/constants/complexLookup.constants';
import { useComplexLookupApi } from '@common/hooks/useComplexLookupApi';
import { useMarcData } from '@common/hooks/useMarcData';
import { COMPLEX_LOOKUPS_CONFIG } from '@src/configs';
import { Modal } from '@components/Modal';
import { Search } from '@components/Search';
import { SearchControlPane } from '@components/SearchControlPane';
import state from '@state';
import { ComplexLookupSearchResults } from './ComplexLookupSearchResults';
import { MarсPreviewComplexLookup } from './MarсPreviewComplexLookup';
import { SEARCH_RESULTS_TABLE_CONFIG } from './configs';
import './ModalComplexLookup.scss';
import { SEARCH_QUERY_BUILDER } from '@common/helpers/search/queryBuilder';

interface ModalComplexLookupProps {
  isOpen: boolean;
  onAssign: ({ id, title, linkedFieldValue }: ComplexLookupAssignRecordDTO) => void;
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
    baseLabelType = 'creator',
  }) => {
    const {
      api,
      segments,
      labels,
      searchBy,
      searchableIndicesMap,
      filters = [],
    } = COMPLEX_LOOKUPS_CONFIG[assignEntityName];
    const tableConfig = SEARCH_RESULTS_TABLE_CONFIG[assignEntityName] || SEARCH_RESULTS_TABLE_CONFIG.default;
    const searchResultsFormatter = SEARCH_RESULTS_FORMATTER[assignEntityName] || SEARCH_RESULTS_FORMATTER.default;
    const buildSearchQuery = SEARCH_QUERY_BUILDER[assignEntityName] || SEARCH_QUERY_BUILDER.default;

    const setIsMarcPreviewOpen = useSetRecoilState(state.ui.isMarcPreviewOpen);
    const setSearchQuery = useSetRecoilState(state.search.query);
    const clearSearchQuery = useResetRecoilState(state.search.query);
    const setMarcMetadata = useSetRecoilState(state.data.marcPreviewMetadata);
    const clearMarcMetadata = useResetRecoilState(state.data.marcPreviewMetadata);
    const { getFacetsData, getSourceData } = useComplexLookupApi(api, filters);
    const { fetchMarcData, clearMarcData } = useMarcData(state.data.marcPreviewData);

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
      clearMarcData();
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
          segmentsConfig={segments.primary}
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

    const renderMarcPreview = useCallback(() => <MarсPreviewComplexLookup onClose={onCloseMarcPreview} />, []);

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
            endpointUrlsBySegments={api.endpoints.bySearchSegment}
            primarySegments={segments?.primary}
            searchFilter={api.searchQuery.filter}
            isSortedResults={false}
            filters={filters}
            hasSearchParams={false}
            defaultNavigationSegment={segments.defaultValues?.segment || SearchSegment.Search}
            defaultSearchBy={
              segments.defaultValues?.searchBy ||
              (searchBy[SearchSegment.Search]?.[0]?.value as unknown as SearchIdentifiers)
            }
            defaultQuery={value}
            renderSearchControlPane={renderSearchControlPane}
            renderResultsList={renderResultsList}
            renderMarcPreview={renderMarcPreview}
            isVisibleFilters={false}
            isVisibleFullDisplay={false}
            isVisibleAdvancedSearch={false}
            isVisibleSearchByControl={true}
            isVisibleSegments={true}
            hasMultilineSearchInput={true}
            hasMarcPreview={true}
            searchByControlOptions={searchBy}
            searchableIndicesMap={searchableIndicesMap}
            labelEmptySearch="ld.chooseFilterOrEnterSearchQuery"
            classNameEmptyPlaceholder="complex-lookup-search-empty"
            getSearchSourceData={getSourceData}
            getSearchFacetsData={getFacetsData}
            fetchSearchResults={getSearchResults}
            buildSearchQuery={buildSearchQuery}
            searchResultsLimit={api.searchQuery.limit}
            precedingRecordsCount={api.searchQuery.precedingRecordsCount}
            searchResultsContainer={api.results.containers}
            onAssignRecord={onAssign}
          />
        </div>
      </Modal>
    );
  },
);
