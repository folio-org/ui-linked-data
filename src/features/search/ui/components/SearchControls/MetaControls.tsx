import { FC, ReactNode, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import classNames from 'classnames';

import { Announcement } from '@/components/Announcement';
import { Button, ButtonType } from '@/components/Button';

import { useUIState } from '@/store';

import { useSearchContext } from '../../providers/SearchProvider';
import { AdvancedSearchModal } from '../AdvancedSearchModal';
import { ResetButton } from './ResetButton';

interface MetaControlsProps {
  isCentered?: boolean;
  children?: ReactNode;
}

export const MetaControls: FC<MetaControlsProps> = ({ isCentered = true, children }) => {
  const { mode, activeUIConfig, onReset } = useSearchContext();
  const [announcementMessage, setAnnouncementMessage] = useState('');
  const { isAdvancedSearchOpen, setIsAdvancedSearchOpen } = useUIState([
    'isAdvancedSearchOpen',
    'setIsAdvancedSearchOpen',
  ]);

  const showAdvancedSearch = activeUIConfig.features?.hasAdvancedSearch;
  const className = classNames(['meta-controls', !showAdvancedSearch && isCentered && 'meta-controls-centered']);

  // Custom mode: render provided children
  if (mode === 'custom' && children) {
    return <div className={className}>{children}</div>;
  }

  // Auto mode: render based on config
  return (
    <>
      <div className={className}>
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

      {/* Advanced Search modal */}
      {showAdvancedSearch && isAdvancedSearchOpen && <AdvancedSearchModal clearValues={onReset} />}
    </>
  );
};
