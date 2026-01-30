import { FC, ReactNode } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import classNames from 'classnames';

import { Button } from '@/components/Button';

import { useUIState } from '@/store';

import CaretDown from '@/assets/caret-down.svg?react';

import { useSearchContext } from '../../providers/SearchProvider';
import { InputsWrapper } from './InputsWrapper';
import { MetaControls } from './MetaControls';
import { SubmitButton } from './SubmitButton';

import './RootControls.scss';

interface RootControlsProps {
  children?: ReactNode;
  className?: string;
  showFilters?: boolean;
  filtersComponent?: ReactNode;
}

export const RootControls: FC<RootControlsProps> = ({ children, className, showFilters = false, filtersComponent }) => {
  const { formatMessage } = useIntl();
  const { mode, activeUIConfig } = useSearchContext();
  const { isSearchPaneCollapsed, setIsSearchPaneCollapsed } = useUIState([
    'isSearchPaneCollapsed',
    'setIsSearchPaneCollapsed',
  ]);

  const handleToggleCollapse = () => {
    setIsSearchPaneCollapsed(prev => !prev);
  };

  // Determine what to render
  const renderContent = () => {
    if (mode === 'custom' && children) {
      return children;
    }

    // Auto mode: render based on config
    // Note: Segments must be provided via children using SegmentGroup/Segment components
    return (
      <>
        {/* Input controls */}
        <InputsWrapper />

        {/* Submit button */}
        {activeUIConfig.features?.hasSubmitButton && <SubmitButton />}

        {/* Meta controls */}
        <MetaControls />

        {/* Filters */}
        {showFilters && filtersComponent}
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
