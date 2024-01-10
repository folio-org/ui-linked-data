import { FC, memo } from 'react';
import './DuplicateGroup.scss';
import { Button, ButtonType } from '@components/Button';

interface Props {
  onClick?: VoidFunction;
}

export const DuplicateGroup: FC<Props> = memo(({ onClick }) => (
  <Button data-testid="id-duplicate-group" type={ButtonType.Text} className="duplicate-group" onClick={onClick}>
    <span>+</span>
  </Button>
));
