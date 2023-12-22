import { FC, memo } from 'react';
import './DuplicateGroup.scss';
import { Button } from '@components/Button';

interface Props {
  onClick?: VoidFunction;
}

export const DuplicateGroup: FC<Props> = memo(({ onClick }) => (
  <Button data-testid="id-duplicate-group" className="duplicate-group" onClick={onClick}>
    <span>+</span>
  </Button>
));
