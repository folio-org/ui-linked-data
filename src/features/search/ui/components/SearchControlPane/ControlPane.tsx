import { FC, type ReactElement } from 'react';
import { useIntl } from 'react-intl';

import classNames from 'classnames';

import { IS_EMBEDDED_MODE } from '@/common/constants/build.constants';
import { Button } from '@/components/Button';

import { useUIState } from '@/store';

import CaretDown from '@/assets/caret-down.svg?react';

import './SearchControlPane.scss';

type ControlPaneProps = {
  children?: ReactElement;
  label?: string | ReactElement;
  subLabel?: ReactElement;
  showSubLabel?: boolean;
  renderCloseButton?: () => ReactElement;
};

export const ControlPane: FC<ControlPaneProps> = ({
  children,
  label,
  subLabel,
  showSubLabel = false,
  renderCloseButton,
}) => {
  const { formatMessage } = useIntl();
  const { isSearchPaneCollapsed, setIsSearchPaneCollapsed } = useUIState([
    'isSearchPaneCollapsed',
    'setIsSearchPaneCollapsed',
  ]);

  return (
    <div className={classNames(['search-control-pane', IS_EMBEDDED_MODE && 'search-control-pane-embedded'])}>
      {renderCloseButton?.()}
      {isSearchPaneCollapsed && (
        <Button
          onClick={() => setIsSearchPaneCollapsed(false)}
          className="open-ctl"
          ariaLabel={formatMessage({ id: 'ld.aria.searchPane.open' })}
        >
          <CaretDown className="header-caret" />
        </Button>
      )}
      {label && (
        <div className="search-control-pane-title">
          <h2 className="search-control-pane-mainLabel">
            <span>{label}</span>
          </h2>

          {showSubLabel && subLabel && (
            <div className="search-control-pane-subLabel">
              <span>{subLabel}</span>
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );
};
