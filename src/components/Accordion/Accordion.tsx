import { FC, useState } from 'react';
import './Accordion.scss';
import CaretDown from '@src/assets/caret-down.svg?react';
import classNames from 'classnames';
import { Button, ButtonType } from '@components/Button';

type Accordion = {
  title?: string | JSX.Element;
  children?: string | JSX.Element;
};

export const Accordion: FC<Accordion> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const handleVisibilityToggle = () => setIsOpen(!isOpen);

  return (
    <section className="accordion">
      <div className="accordion-toggle">
        <Button
          type={ButtonType.Text}
          aria-expanded={isOpen}
          onClick={handleVisibilityToggle}
          className="accordion-toggle-button"
        >
          <div className="accordion-toggle-container">
            <CaretDown className={classNames({ icon: true, ['icon-collapsed']: !isOpen })} />
            <div>{title}</div>
          </div>
        </Button>
      </div>
      <div hidden={!isOpen}>{children}</div>
    </section>
  );
};
