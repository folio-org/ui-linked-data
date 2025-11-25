import { FC, useState, ReactNode } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import classNames from 'classnames';
import { DOM_ELEMENTS } from '@/common/constants/domElementsIdentifiers.constants';
import { Button, ButtonType } from '@/components/Button';
import { Announcement } from '@/components/Announcement';
import CaretDown from '@/assets/caret-down.svg?react';
import { useUIState } from '@/store';
import { useSearchContext } from '../../providers/SearchProvider';
import { AdvancedSearchModal } from '../AdvancedSearchModal';
import { Segments } from './Segments';
import { QueryInput } from './QueryInput';
import { SearchBySelect } from './SearchBySelect';
import { SubmitButton } from './SubmitButton';
import { ResetButton } from './ResetButton';
import './SearchControls.scss';

interface RootProps {
  children?: ReactNode;
  className?: string;
  showFilters?: boolean;
  filtersComponent?: ReactNode;
  renderSearchControlPane?: () => ReactNode;
  renderResultsList?: () => ReactNode;
}

export const SearchControls: FC<RootProps> = ({
  children,
  className,
  showFilters = false,
  filtersComponent,
  renderSearchControlPane,
  renderResultsList,
}) => {
  const { formatMessage } = useIntl();
  const { mode, activeUIConfig, onReset } = useSearchContext();
  const [announcementMessage, setAnnouncementMessage] = useState('');
  const { isSearchPaneCollapsed, setIsSearchPaneCollapsed, isAdvancedSearchOpen, setIsAdvancedSearchOpen } = useUIState(
    ['isSearchPaneCollapsed', 'setIsSearchPaneCollapsed', 'isAdvancedSearchOpen', 'setIsAdvancedSearchOpen'],
  );

  const handleToggleCollapse = () => {
    setIsSearchPaneCollapsed(prev => !prev);
  };

  // Determine what to render
  const renderContent = () => {
    if (mode === 'custom' && children) {
      return (
        <div data-testid="id-search" className={DOM_ELEMENTS.classNames.itemSearch}>
          {children}
        </div>
      );
    }

    const showAdvancedSearch = activeUIConfig.features?.hasAdvancedSearch;

    // Auto mode: render based on config
    return (
      <>
        {/* Segments */}
        {activeUIConfig.features?.hasSegments && <Segments />}

        {/* Input controls */}
        <div className="inputs">
          {activeUIConfig.features?.hasSearchBy && <SearchBySelect />}
          {activeUIConfig.features?.hasQueryInput && <QueryInput />}
        </div>

        {/* Submit button */}
        {activeUIConfig.features?.hasSubmitButton && <SubmitButton />}

        {/* Meta controls */}
        <div className={classNames(['meta-controls', !showAdvancedSearch && 'meta-controls-centered'])}>
          <ResetButton />
          <Announcement message={announcementMessage} onClear={() => setAnnouncementMessage('')} />
          {showAdvancedSearch && (
            <Button
              type={ButtonType.Link}
              className="search-button"
              onClick={() => setIsAdvancedSearchOpen(isOpen => !isOpen)}
            >
              <FormattedMessage id="ld.advanced" />
            </Button>
          )}
        </div>

        {/* Filters */}
        {showFilters && filtersComponent}

        {/* Advanced Search modal */}
        {showAdvancedSearch && isAdvancedSearchOpen && <AdvancedSearchModal clearValues={onReset} />}
      </>
    );
  };

  return (
    <div data-testid="id-search" className={DOM_ELEMENTS.classNames.itemSearch}>
      {!isSearchPaneCollapsed && (
        <section className={classNames('search-pane', className)} aria-labelledby="search-pane-header-title">
          <div className="search-pane-header">
            <h2 id="search-pane-header-title" className="search-pane-header-title">
              <FormattedMessage id={showFilters ? 'ld.searchAndFilter' : 'ld.search'} />
            </h2>
            <Button
              className="close-ctl"
              onClick={handleToggleCollapse}
              ariaLabel={formatMessage({ id: 'ld.aria.searchPane.close' })}
            >
              <CaretDown />
            </Button>
          </div>
          <div className="search-pane-content">{renderContent()}</div>
        </section>
      )}
      <div className={DOM_ELEMENTS.classNames.itemSearchContent}>
        {renderSearchControlPane?.()}

        <div className={DOM_ELEMENTS.classNames.itemSearchContentContainer}>{renderResultsList?.()}</div>
      </div>
    </div>
  );
};
