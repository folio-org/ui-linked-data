import { FC, ReactNode, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { Button, ButtonType } from '@/components/Button';
import { Announcement } from '@/components/Announcement';
import { useUIState } from '@/store';
import { useSearchContext } from '../../providers/SearchProvider';
import { AdvancedSearchModal } from '../AdvancedSearchModal';
import { ResetButton } from './ResetButton';

interface MetaControlsProps {
  children?: ReactNode;
}

export const MetaControls: FC<MetaControlsProps> = ({ children }) => {
  const { mode, activeUIConfig, onReset } = useSearchContext();
  const [announcementMessage, setAnnouncementMessage] = useState('');
  const { isAdvancedSearchOpen, setIsAdvancedSearchOpen } = useUIState([
    'isAdvancedSearchOpen',
    'setIsAdvancedSearchOpen',
  ]);

  const showAdvancedSearch = activeUIConfig.features?.hasAdvancedSearch;

  // Custom mode: render provided children
  if (mode === 'custom' && children) {
    return (
      <div className={classNames(['meta-controls', !showAdvancedSearch && 'meta-controls-centered'])}>{children}</div>
    );
  }

  // Auto mode: render based on config
  return (
    <>
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

      {/* Advanced Search modal */}
      {showAdvancedSearch && isAdvancedSearchOpen && <AdvancedSearchModal clearValues={onReset} />}
    </>
  );
};
