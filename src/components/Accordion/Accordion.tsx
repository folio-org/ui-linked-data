import { FC, ReactNode, useState } from 'react';
import './Accordion.scss';
import CaretDown from '@src/assets/caret-down.svg?react';
import classNames from 'classnames';
import { Button, ButtonType } from '@components/Button';

type Accordion = {
  title?: string | JSX.Element;
  groupId?: string;
  defaultState?: boolean;
  onToggle?: (facet?: string, isOpen?: boolean) => void;
  children?: string | ReactNode;
};

export const Accordion: FC<Accordion> = ({ title, groupId, defaultState = false, onToggle, children }) => {
  const [isOpen, setIsOpen] = useState(defaultState);

  const handleVisibilityToggle = () => {
    const updatedIsOpenState = !isOpen;

    setIsOpen(updatedIsOpenState);
    onToggle?.(groupId, updatedIsOpenState);
  };

  return (
    <section className="accordion">
      <div className="accordion-toggle">
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
      <div data-testid="accordion-contents" hidden={!isOpen}>
        {children}
      </div>
    </section>
  );
};
