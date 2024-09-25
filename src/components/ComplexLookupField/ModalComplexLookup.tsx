import { FC, memo, useCallback, useEffect, useMemo } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { useSearchFiltersData } from '@common/hooks/useSearchFiltersData';
import { IS_EMBEDDED_MODE } from '@common/constants/build.constants';
import { COMPLEX_LOOKUPS_CONFIG } from '@common/constants/complexLookup.constants';
import { SearchSegment } from '@common/constants/search.constants';
import { Modal } from '@components/Modal';
import { Search } from '@components/Search';
import { SearchControlPane } from '@components/SearchControlPane';
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
    const { api, segments, labels, searchBy, filters = [] } = COMPLEX_LOOKUPS_CONFIG[assignEntityName];
    const searchResultsMetadata = useRecoilValue(state.search.pageMetadata);
    const setFacetsData = useSetRecoilState(state.search.facetsData);
    const { getSearchSourceData, getSearchFacetsData } = useSearchFiltersData();
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

    const getFacetsData = async (facet?: string, isOpen?: boolean) => {
      await getSearchFacetsData(api.endpoints.facets, facet, isOpen);
    };

    const getSourceData = async () => {
      await getSearchSourceData(api.endpoints.source, api.sourceKey);

      const openedFilter = filters.find(({ isOpen }) => isOpen);
      await getFacetsData(openedFilter?.facet);
    };

    useEffect(() => {
      if (!isOpen || !api.endpoints.source) return;

      getSourceData();

      return () => {
        setFacetsData({});
      };
    }, [isOpen]);

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
            hasMiltilineSearchInput={true}
            searchByControlOptions={searchBy}
            labelEmptySearch="marva.chooseFilterOrEnterSearchQuery"
            classNameEmptyPlaceholder="complex-lookup-search-empty"
            getSearchSourceData={getSourceData}
            getSearchFacetsData={getFacetsData}
          />
        </div>
      </Modal>
    );
  },
);
