import { FC, memo } from 'react';
import classNames from 'classnames';
import { Button, ButtonType } from '@components/Button';
import Plus16 from '@src/assets/plus-16.svg?react';
import Trash16 from '@src/assets/trash-16.svg?react';
import { getHtmlIdForSchemaControl } from '@common/helpers/schema.helper';
import { SchemaControlType } from '@common/constants/uiControls.constants';
import './DuplicateGroup.scss';
import { useIntl } from 'react-intl';

interface Props {
  onClickDuplicate?: VoidFunction;
  onClickDelete?: VoidFunction;
  hasDeleteButton?: boolean;
  deleteDisabled?: boolean;
  className?: string;
  htmlId?: string;
}

export const DuplicateGroup: FC<Props> = memo(
  ({ onClickDuplicate, onClickDelete, hasDeleteButton = true, className, htmlId, deleteDisabled = true }) => {
    const { formatMessage } = useIntl();

    return (
      <div className={classNames(['duplicate-group', className])}>
        <Button
          data-testid={getHtmlIdForSchemaControl(SchemaControlType.Duplicate, htmlId)}
          type={ButtonType.Icon}
          onClick={onClickDuplicate}
          ariaLabel={formatMessage({ id: 'ld.aria.edit.duplicateComponent' })}
        >
          <Plus16 />
        </Button>
        {hasDeleteButton && (
          <Button
            data-testid={getHtmlIdForSchemaControl(SchemaControlType.RemoveDuplicate, htmlId)}
            type={ButtonType.Icon}
            disabled={deleteDisabled}
            onClick={onClickDelete}
            ariaLabel={formatMessage({ id: 'ld.aria.edit.deleteComponent' })}
          >
            <Trash16 />
          </Button>
        )}
      </div>
    );
  },
);
