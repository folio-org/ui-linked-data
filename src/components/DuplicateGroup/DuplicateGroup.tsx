import { FC, memo } from 'react';
import { Button, ButtonType } from '@components/Button';
import Plus16 from '@src/assets/plus-16.svg?react';
import Trash16 from '@src/assets/trash-16.svg?react';
import './DuplicateGroup.scss';

interface Props {
  onClick?: VoidFunction;
}

export const DuplicateGroup: FC<Props> = memo(({ onClick }) => (
  <div className='duplicate-group'>
    <Button data-testid="id-duplicate-group" type={ButtonType.Icon} onClick={onClick}>
      <Plus16 />
    </Button>
    <Button data-testid="id-delete-duplicate-group" type={ButtonType.Icon}>
      <Trash16 />
    </Button>
  </div>
));
