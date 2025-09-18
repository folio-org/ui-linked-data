import { FC, useState, useEffect, useRef, ReactNode } from 'react';
import classNames from 'classnames';
import './Tooltip.scss';

interface TooltipProps {
  content: ReactNode;
  triggerContent: ReactNode;
  triggerOpenAriaLabel?: string;
  triggerCloseAriaLabel?: string;
  className?: string;
  contentClassName?: string;
  ['data-testid']?: string;
}

export const Tooltip: FC<TooltipProps> = ({
  content,
  triggerContent,
  triggerOpenAriaLabel,
  triggerCloseAriaLabel,
  className,
  contentClassName,
  'data-testid': dataTestId,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!tooltipRef.current?.contains(event.target as Node) && !buttonRef.current?.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isVisible) {
        setIsVisible(false);

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

  return (
    <div className={classNames(['tooltip-container', className])}>
      <button
        ref={buttonRef}
        className="button button-icon"
        aria-label={isVisible ? triggerCloseAriaLabel : triggerOpenAriaLabel}
        aria-expanded={isVisible}
        aria-haspopup="dialog"
        onClick={() => setIsVisible(prev => !prev)}
        data-testid={dataTestId}
      >
        {triggerContent}
      </button>

      {isVisible && (
        <div
          ref={tooltipRef}
          className={classNames(['tooltip-content', contentClassName])}
          tabIndex={-1}
          role="dialog"
          data-testid={`${dataTestId}__content`}
        >
          {content}
        </div>
      )}
    </div>
  );
};
