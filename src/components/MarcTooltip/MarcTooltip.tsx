import { FC, useState, useEffect, useRef } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import classNames from 'classnames';
import InfoIcon from '@src/assets/info.svg?react';
import './MarcTooltip.scss';

export interface MarcMapping {
  [fieldName: string]: string;
}

interface MarcTooltipProps {
  mapping: MarcMapping | undefined;
  className?: string;
}

export const MarcTooltip: FC<MarcTooltipProps> = ({ mapping, className }) => {
  const { formatMessage } = useIntl();
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Handle click outside to close the tooltip
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!tooltipRef.current?.contains(event.target as Node) && !buttonRef.current?.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };

    // Handle escape key to close the tooltip
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isVisible) {
        setIsVisible(false);
        // Return focus to the button when closing with Escape
        buttonRef.current?.focus();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isVisible]);

  if (!mapping || Object.keys(mapping).length === 0) {
    return null;
  }

  return (
    <div className={classNames(['marc-tooltip-container', className])}>
      <button
        ref={buttonRef}
        className="button button-icon"
        onClick={() => setIsVisible(!isVisible)}
        aria-label={formatMessage({ id: isVisible ? 'ld.showMarcFieldEquivalents' : 'ld.hideMarcFieldEquivalents' })}
        aria-expanded={isVisible}
        aria-haspopup="dialog"
      >
        <InfoIcon className="marc-tooltip-icon" />
      </button>
      {isVisible && (
        <div
          ref={tooltipRef}
          role="contentinfo"
          className="marc-tooltip-content"
          aria-labelledby="marc-tooltip-title"
          tabIndex={-1}
        >
          <h4 id="marc-tooltip-title" className="marc-tooltip-title">
            <FormattedMessage id="ld.marcFieldEquivalents" defaultMessage="MARC field equivalents" />
          </h4>
          {Object.entries(mapping).map(([field, marc]) => (
            <div key={field} className="marc-tooltip-row">
              <span className="marc-tooltip-field">{field}:</span>
              <span className="marc-tooltip-mapping">{marc}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
