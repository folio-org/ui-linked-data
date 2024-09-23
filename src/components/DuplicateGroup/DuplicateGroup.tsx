import { FC, memo } from 'react';
import classNames from 'classnames';
import { Button, ButtonType } from '@components/Button';
import { IS_DISABLED_FOR_ALPHA } from '@common/constants/feature.constants';
import Plus16 from '@src/assets/plus-16.svg?react';
import Trash16 from '@src/assets/trash-16.svg?react';
import { getHtmlIdForSchemaControl } from '@common/helpers/schema.helper';
import { SchemaControlType } from '@common/constants/uiControls.constants';
import './DuplicateGroup.scss';

interface Props {
  onClick?: VoidFunction;
  hasDeleteButton?: boolean;
  className?: string;
  htmlId?: string;
}

export const DuplicateGroup: FC<Props> = memo(({ onClick, hasDeleteButton = true, className, htmlId }) => (
  <div className={classNames(['duplicate-group', className])}>
    <Button
      id={getHtmlIdForSchemaControl(htmlId, SchemaControlType.Duplicate)}
      data-testid="id-duplicate-group"
      type={ButtonType.Icon}
      onClick={onClick}
    >
      <Plus16 />
    </Button>
    {hasDeleteButton && (
      <Button
        id={getHtmlIdForSchemaControl(htmlId, SchemaControlType.RemoveDuplicate)}
        data-testid="id-delete-duplicate-group"
        type={ButtonType.Icon}
        disabled={IS_DISABLED_FOR_ALPHA}
      >
        <Trash16 />
      </Button>
    )}
  </div>
));
