import { FC, useState, ReactNode } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import classNames from 'classnames';
import { Button, ButtonType } from '@/components/Button';
import { Announcement } from '@/components/Announcement';
import CaretDown from '@/assets/caret-down.svg?react';
import { useSearchControlsContext } from '../../providers/SearchControlsProvider';
import { Segments } from './Segments';
import { QueryInput } from './QueryInput';
import { SearchBySelect } from './SearchBySelect';
import { SubmitButton } from './SubmitButton';
import { ResetButton } from './ResetButton';
import './Root.scss';

interface RootProps {
  children?: ReactNode;
  className?: string;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  showFilters?: boolean;
  filtersComponent?: ReactNode;
  showAdvancedSearch?: boolean;
  onAdvancedSearchClick?: () => void;
}

export const Root: FC<RootProps> = ({
  children,
  className,
  collapsed = false,
  onCollapsedChange,
  showFilters = false,
  filtersComponent,
  showAdvancedSearch = false,
  onAdvancedSearchClick,
}) => {
  const { formatMessage } = useIntl();
  const { mode, activeUIConfig } = useSearchControlsContext();
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const [announcementMessage, setAnnouncementMessage] = useState('');

  const handleToggleCollapse = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onCollapsedChange?.(newCollapsed);
  };

  // Determine what to render
  const renderContent = () => {
    // Custom mode: use provided children
    if (mode === 'custom' && children) {
      return children;
    }

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
            <Button type={ButtonType.Link} className="search-button" onClick={onAdvancedSearchClick}>
              <FormattedMessage id="ld.advanced" />
            </Button>
          )}
        </div>

        {/* Filters */}
        {showFilters && filtersComponent}
      </>
    );
  };

  if (isCollapsed) {
    return null;
  }

  return (
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
  );
};
