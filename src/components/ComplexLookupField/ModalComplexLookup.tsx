import { FC, memo } from 'react';
import { SEARCH_API_ENDPOINT } from '@common/constants/api.constants';
import { Modal } from '@components/Modal';
import { ItemSearch } from '@components/ItemSearch';
import { SearchControlPane } from '@components/SearchControlPane';
import './ModalComplexLookup.scss';

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
        <ItemSearch
          // TODO: Extend the profile with the endpoint and use it here
          endpointUrl={`${SEARCH_API_ENDPOINT}/authorities`}
          isSortedResults={false}
          filters={[]}
          hasSearchParams={false}
          defaultSearchBy={'label' as SearchIdentifiers}
          controlPaneComponent={<SearchControlPane label={searchPaneTitle} />}
          // TODO: create a component
          resultsListComponent={<div />}
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
