import { FC, ReactNode, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import classNames from 'classnames';
import { Button, ButtonType } from '@/components/Button';
import { Announcement } from '@/components/Announcement';
import CaretDown from '@/assets/caret-down.svg?react';
import { useUIState } from '@/store';
import { useSearchContext } from '../../providers/SearchProvider';
import { AdvancedSearchModal } from '../AdvancedSearchModal';
import { SearchControls as SearchControlsCompound } from '.';
import './SearchControls.scss';

interface SearchControlsProps {
  children?: ReactNode;
  className?: string;
  showFilters?: boolean;
  filtersComponent?: ReactNode;
}

export const SearchControls: FC<SearchControlsProps> = ({
  children,
  className,
  showFilters = false,
  filtersComponent,
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
      return children;
    }

    const showAdvancedSearch = activeUIConfig.features?.hasAdvancedSearch;

    // Auto mode: render based on config
    return (
      <>
        {/* Segments */}
        {activeUIConfig.features?.hasSegments && <SearchControlsCompound.Segments />}

        {/* Input controls */}
        <div className="inputs">
          {activeUIConfig.features?.hasSearchBy && <SearchControlsCompound.SearchBySelect />}
          {activeUIConfig.features?.hasQueryInput && <SearchControlsCompound.QueryInput />}
        </div>

        {/* Submit button */}
        {activeUIConfig.features?.hasSubmitButton && <SearchControlsCompound.SubmitButton />}

        {/* Meta controls */}
        <div className={classNames(['meta-controls', !showAdvancedSearch && 'meta-controls-centered'])}>
          <SearchControlsCompound.ResetButton />
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
    <>
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
    </>
  );
};
