import { FormattedMessage, useIntl } from 'react-intl';
import { Pagination } from '@components/Pagination';
import { useState } from 'react';
import { useInputsState, useSearchState, useUIState } from '@src/store';
import { Button, ButtonType } from '@components/Button';
import Times16 from '@src/assets/times-16.svg?react';
import TimesCircle12 from '@src/assets/times-circle-12.svg?react';
import Transfer16 from '@src/assets/transfer-16.svg?react';
import GeneralSearch from '@src/assets/general-search.svg?react';
import { Preview } from '@components/Preview';
import { PreviewActionsDropdown } from '@components/PreviewActionsDropdown';
import { ResourceType } from '@common/constants/record.constants';
import { generateEditResourceUrl } from '@common/helpers/navigation.helper';
import { useNavigateToEditPage } from '@common/hooks/useNavigateToEditPage';
import './Comparison.scss';

export const Comparison = () => {
  const { formatMessage } = useIntl();
  const { previewContent, setPreviewContent, resetPreviewContent } = useInputsState();
  const { setSelectedInstances, resetSelectedInstances } = useSearchState();
  const { resetFullDisplayComponentType } = useUIState();
  const { navigateToEditPage } = useNavigateToEditPage();
  const [currentPage, setCurrentPage] = useState(0);

  const handleCloseComparison = () => {
    resetPreviewContent();
    resetFullDisplayComponentType();
    resetSelectedInstances();
  };

  const handleRemoveComparisonItem = (id: string) => {
    if (currentPage === totalPages - 1) {
      setCurrentPage(prevValue => {
        const previousPage = prevValue - 1;

        return previousPage >= 0 ? previousPage : 0;
      });
    }

    setPreviewContent(prev => {
      const updatedPreviewContent = prev.filter(({ id: prevId }) => prevId !== id);

      if (!updatedPreviewContent.length) {
        resetFullDisplayComponentType();
      }

      return updatedPreviewContent;
    });
    setSelectedInstances(prev => prev.filter(prevId => prevId !== id));
  };

  const handleNavigateToOwnEditPage = (id: string) => navigateToEditPage(generateEditResourceUrl(id));
  const totalPages = (previewContent.length > 1 ? previewContent.length : 2) - 1;

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
            <FormattedMessage id="ld.nResourcesSelected" values={{ n: previewContent.length }} />
          </span>
          <Button
            data-testid="clear-comparison-selections"
            type={ButtonType.Icon}
            onClick={handleCloseComparison}
            disabled={!previewContent.length}
            className="nav-close"
          >
            <TimesCircle12 />
            <FormattedMessage id="ld.clearSelections" />
          </Button>
        </div>
      </header>
      <div className="comparison-contents">
        {previewContent
          .slice(currentPage, currentPage + 2)
          .map(({ initKey, base, userValues, id, title, referenceIds }) => (
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
                    referenceId={referenceIds?.[0]?.id as unknown as string}
                    entityType={ResourceType.instance}
                    handleNavigateToEditPage={() => handleNavigateToOwnEditPage(id)}
                  />
                </div>
                <h3>{title}</h3>
              </div>
              <Preview
                altInitKey={initKey}
                altSchema={base}
                altUserValues={userValues}
                forceRenderAllTopLevelEntities
              />
            </section>
          ))}
        {previewContent.length <= 1 && (
          <div className="insufficient-resource-amt" data-testid="insufficient-resource-amt">
            <GeneralSearch />
            <FormattedMessage
              id={!previewContent.length ? 'ld.chooseTwoResourcesCompare' : 'ld.chooseOneResourceCompare'}
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
          totalResultsCount={totalPages}
          showCount
        />
      </nav>
    </section>
  );
};
