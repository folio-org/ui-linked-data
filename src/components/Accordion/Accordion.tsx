import { FC, ReactNode, useState, type JSX } from 'react';
import classNames from 'classnames';
import CaretDown from '@src/assets/caret-down.svg?react';
import { Button, ButtonType } from '@components/Button';
import './Accordion.scss';

type Accordion = {
  id?: string;
  title?: string | JSX.Element;
  groupId?: string;
  defaultState?: boolean;
  onToggle?: (facet?: string, isOpen?: boolean) => void;
  children?: string | ReactNode;
};

export const Accordion: FC<Accordion> = ({ id, title, groupId, defaultState = false, onToggle, children }) => {
  const [isOpen, setIsOpen] = useState(defaultState);
  const identifier = id ?? groupId;
  const togglerTestId = identifier ? `accordion-toggle-${identifier}` : '';
  const contentsTestId = identifier ? `accordion-contents-${identifier}` : '';

  const handleVisibilityToggle = () => {
    const updatedIsOpenState = !isOpen;

    setIsOpen(updatedIsOpenState);
    onToggle?.(groupId, updatedIsOpenState);
  };

  return (
    <section className="accordion">
      <div className="accordion-toggle" data-testid={`accordion-toggle ${togglerTestId}`}>
        <Button
          type={ButtonType.Text}
          aria-expanded={isOpen}
          onClick={handleVisibilityToggle}
          className="accordion-toggle-button"
          data-testid="accordion-toggle-button"
        >
          <div className="accordion-toggle-container">
            <CaretDown className={classNames({ icon: true, ['icon-collapsed']: !isOpen })} />
            <div>{title}</div>
          </div>
        </Button>
      </div>
      <div data-testid={`accordion-contents ${contentsTestId}`} hidden={!isOpen}>
        {children}
      </div>
    </section>
  );
};
