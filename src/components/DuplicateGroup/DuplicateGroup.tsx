import { FC, memo } from 'react';
import './DuplicateGroup.scss';

interface Props {
  onClick?: () => void;
}

export const DuplicateGroup: FC<Props> = memo(({ onClick }) => (
  <button data-testid="id-duplicate-group" className="duplicate-group" onClick={onClick}>
    <span>+</span>
  </button>
));
