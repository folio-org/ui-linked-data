import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { ResourceType } from '@/common/constants/record.constants';
import { generateEditResourceUrl } from '@/common/helpers/navigation.helper';
import { useNavigateToEditPage } from '@/common/hooks/useNavigateToEditPage';
import { Button, ButtonType } from '@/components/Button';
import { Pagination } from '@/components/Pagination';

import { useComparisonData } from '@/features/comparison/hooks';
import { Preview, PreviewActionsDropdown } from '@/features/preview';

import { useLoadingState, useSearchState, useUIState } from '@/store';

import GeneralSearch from '@/assets/general-search.svg?react';
import Times16 from '@/assets/times-16.svg?react';
import TimesCircle12 from '@/assets/times-circle-12.svg?react';
import Transfer16 from '@/assets/transfer-16.svg?react';

import './Comparison.scss';

const COMPARED_ELEMENTS_COUNT = 2;

export const Comparison = () => {
  const { formatMessage } = useIntl();
  const { setSelectedInstances, resetSelectedInstances, selectedInstances } = useSearchState([
    'setSelectedInstances',
    'resetSelectedInstances',
    'selectedInstances',
  ]);
  const { resetFullDisplayComponentType } = useUIState(['resetFullDisplayComponentType']);
  const { setIsLoading, resetIsLoading } = useLoadingState(['setIsLoading', 'resetIsLoading']);
  const { navigateToEditPage } = useNavigateToEditPage();
  const [currentPage, setCurrentPage] = useState(0);

  const { items, isLoading } = useComparisonData(selectedInstances);

  useEffect(() => {
    setIsLoading(isLoading);

    return () => resetIsLoading();
  }, [isLoading]);

  const handleCloseComparison = () => {
    resetFullDisplayComponentType();
    resetSelectedInstances();
  };

  const handleRemoveComparisonItem = (id: string) => {
    if (currentPage === totalPages - 1) {
      setCurrentPage(prevValue => {
        const previousPage = prevValue - 1;

        return Math.max(previousPage, 0);
      });
    }

    const updatedInstances = selectedInstances.filter(prevId => prevId !== id);

    if (!updatedInstances.length) {
      resetFullDisplayComponentType();
    }

    setSelectedInstances(updatedInstances);
  };

  const handleNavigateToOwnEditPage = (id: string) => navigateToEditPage(generateEditResourceUrl(id));
  const totalPages = (selectedInstances.length > 1 ? selectedInstances.length : 2) - 1;

  return (
    <section className="comparison">
      <header>
        <div className="heading">
          <Button
            data-testid="close-comparison-section"
            type={ButtonType.Icon}
            onClick={handleCloseComparison}
            className="nav-close"
            ariaLabel={formatMessage({ id: 'ld.aria.comparison.close' })}
          >
            <Times16 />
          </Button>
          <h2>
            <Transfer16 />
            <FormattedMessage id="ld.compareResources" />
          </h2>
          <span className="empty-block" />
        </div>
        <div className="subheading">
          <span>
            <FormattedMessage id="ld.nResourcesSelected" values={{ n: selectedInstances.length }} />
          </span>
          <Button
            data-testid="clear-comparison-selections"
            type={ButtonType.Icon}
            onClick={handleCloseComparison}
            disabled={!selectedInstances.length}
            className="nav-close"
          >
            <TimesCircle12 />
            <FormattedMessage id="ld.clearSelections" />
          </Button>
        </div>
      </header>
      <div className="comparison-contents">
        {items
          .toSorted((a, b) => selectedInstances.indexOf(a.id) - selectedInstances.indexOf(b.id))
          .slice(currentPage, currentPage + 2)
          .map(({ id, data }, index) => (
            <section key={id} className="entry">
              <div className="entry-header">
                <div className="entry-header-controls">
                  <Button
                    data-testid={`remove-comparison-entry-${id}`}
                    type={ButtonType.Icon}
                    onClick={() => handleRemoveComparisonItem(id)}
                    className="nav-close"
                    ariaLabel={formatMessage({ id: 'ld.aria.comparison.removeEntry' })}
                  >
                    <Times16 />
                  </Button>
                  <PreviewActionsDropdown
                    ownId={id}
                    referenceId={data?.referenceIds?.[0]?.id as unknown as string}
                    entityType={ResourceType.instance}
                    handleNavigateToEditPage={() => handleNavigateToOwnEditPage(id)}
                  />
                </div>
                <h3>
                  <span className="comparison-index">{currentPage + index + 1}</span>
                  <span>{data?.title}</span>
                </h3>
              </div>
              {data && (
                <Preview
                  altInitKey={data.initKey}
                  altSchema={data.schema}
                  altUserValues={data.userValues}
                  altSelectedEntries={data.selectedEntries}
                  forceRenderAllTopLevelEntities
                />
              )}
            </section>
          ))}
        {selectedInstances.length <= 1 && (
          <div className="insufficient-resource-amt" data-testid="insufficient-resource-amt">
            <GeneralSearch />
            <FormattedMessage
              id={selectedInstances.length ? 'ld.chooseOneResourceCompare' : 'ld.chooseTwoResourcesCompare'}
            />
          </div>
        )}
      </div>
      <nav aria-label={formatMessage({ id: 'ld.selectedResources' })}>
        <Pagination
          currentPage={currentPage}
          onNextPageClick={() => setCurrentPage(prev => prev + 1)}
          onPrevPageClick={() => setCurrentPage(prev => prev - 1)}
          totalPages={totalPages}
          totalResultsCount={selectedInstances.length}
          useSlidingWindow={true}
          pageSize={COMPARED_ELEMENTS_COUNT}
          showCount
        />
      </nav>
    </section>
  );
};
