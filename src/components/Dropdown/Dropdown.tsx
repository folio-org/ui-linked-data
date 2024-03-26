import React, { FC, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { DropdownItemType } from '@common/constants/uiElements.constants';
import Caret from '@src/assets/dropdown-caret.svg?react';
import './Dropdown.scss';

type DropdownProps = {
  labelId: string;
  data: DropdownItems;
};

export const Dropdown: FC<DropdownProps> = ({ labelId, data }) => {
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const optionsListRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLButtonElement[] | null[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const expand = () => setIsExpanded(true);

  const collapse = () => {
    setIsExpanded(false);

    buttonRef.current?.focus();
  };
  const toggle = () => setIsExpanded(oldValue => !oldValue);

  const handleButtonKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    event.preventDefault();

    buttonRef.current?.blur();

    switch (event.key) {
      case 'ArrowDown':
        expand();

        if (optionsListRef.current) {
          (optionsListRef.current.childNodes[0] as HTMLLIElement).focus();
        }
        break;

      case 'ArrowUp':
        expand();

        if (optionsListRef.current) {
          const lastIndex = optionsListRef.current.childNodes.length - 1;
          (optionsListRef.current.childNodes[lastIndex] as HTMLLIElement).focus();
        }
        break;

      case 'Enter':
      case ' ':
        toggle();
        break;

      default:
        break;
    }
  };

  const handleOptionKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    event.preventDefault();

    const { key, currentTarget } = event;
    const { nextSibling, previousSibling, parentNode } = currentTarget;

    switch (key) {
      case 'ArrowDown':
        if (nextSibling) {
          (nextSibling as HTMLLIElement).focus();
          break;
        }

        if (!nextSibling) {
          (parentNode?.childNodes[0] as HTMLLIElement).focus();
        }
        break;

      case 'ArrowUp':
        if (previousSibling) {
          (previousSibling as HTMLLIElement).focus();
          break;
        }

        if (!previousSibling && parentNode) {
          const indexOfLastElement = parentNode.childNodes?.length - 1;
          (parentNode.childNodes[indexOfLastElement] as HTMLLIElement).focus();
        }
        break;

      case ' ':
        optionsRef.current[index]?.click();
        collapse();
        break;

      case 'Enter':
      case 'Escape':
        collapse();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (isExpanded && optionsListRef.current) {
      (optionsListRef.current.childNodes[0] as HTMLLIElement).focus();
    }
  }, [isExpanded]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="dropdown">
      <button
        type="button"
        className={classNames(['dropdown-button', isExpanded ? 'expanded' : 'collapsed', 'button-highlighted'])}
        ref={buttonRef}
        onClick={toggle}
        onKeyDown={handleButtonKeyDown}
        aria-expanded={isExpanded}
      >
        <span className="dropdown-button-label">
          <FormattedMessage id={labelId} />
        </span>
        <Caret className="dropdown-icon" />
      </button>

      <div className={classNames(['dropdown-options', isExpanded ? 'expanded' : 'collapsed'])}>
        {data?.map(({ id, labelId, data }) => (
          <div key={id} className="dropdown-options-group">
            {labelId && (
              <div className="dropdown-options-group-label">
                <span>
                  <FormattedMessage id={labelId} />
                </span>
              </div>
            )}

            {data.length > 0 && (
              <div ref={optionsListRef} role="menu" className="dropdown-options-group-container">
                {data?.map(({ id, type, icon, labelId, renderComponent, isDisabled, action }, index) => {
                  switch (type) {
                    case DropdownItemType.basic:
                      return (
                        <button
                          type="button"
                          key={id}
                          ref={elem => (optionsRef.current[index] = elem)}
                          role="menuitem"
                          disabled={isDisabled}
                          aria-disabled={isDisabled}
                          tabIndex={isExpanded ? 0 : -1}
                          onClick={() => {
                            action?.();
                            toggle();
                          }}
                          onKeyDown={event => handleOptionKeyDown(event, index)}
                          className="dropdown-options-button button-text"
                        >
                          {icon && <span className="dropdown-options-button-icon">{icon}</span>}
                          <span className="dropdown-options-button-label">
                            <FormattedMessage id={labelId} />
                          </span>
                        </button>
                      );
                    case DropdownItemType.customComponent:
                      return renderComponent?.(id);

                    default:
                      return null;
                  }
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
