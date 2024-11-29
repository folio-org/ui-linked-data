import { FC, useEffect } from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { StatusType } from '@common/constants/status.constants';
import { Button, ButtonType } from '@components/Button';
import { useStatusState } from '@src/store';
import CloseIcon from '@src/assets/times-16.svg?react';
import CheckCircleIcon from '@src/assets/check-circle.svg?react';
import WarningIcon from '@src/assets/exclamation-triangle.svg?react';
import ErrorIcon from '@src/assets/exclamation-circle.svg?react';
import './CommonStatus.scss';

const DELETE_TIMEOUT = 10000;

export const CommonStatus: FC = () => {
  const { statusMessages, setStatusMessages } = useStatusState();

  const deleteMessage = (messageId?: string) => {
    setStatusMessages(statusMessages.filter(({ id }) => id !== messageId));
  };

  const deleteOldestMessage = () => deleteMessage(statusMessages[0].id);

  useEffect(() => {
    if (!statusMessages.length) {
      return;
    }

    setTimeout(deleteOldestMessage, DELETE_TIMEOUT);
  }, [statusMessages]);

  const renderIcon = (type: StatusType) => {
    switch (type) {
      case StatusType.success:
        return <CheckCircleIcon className="status-message-icon" />;
      case StatusType.warning:
        return <WarningIcon className="status-message-icon" />;
      case StatusType.error:
        return <ErrorIcon className="status-message-icon" />;
      default:
        return null;
    }
  };

  return statusMessages?.length ? (
    <div className="common-status" data-testid="common-status">
      {statusMessages.map(({ id, type, message }) => (
        <div key={id} className={classNames(['status-message', type])} role="status">
          {renderIcon(type as StatusType)}
          <span className="status-message-text">
            <FormattedMessage id={message as string} defaultMessage={message as string} />
          </span>
          <Button className="status-message-close" type={ButtonType.Text} onClick={() => deleteMessage(id)}>
            <CloseIcon />
          </Button>
        </div>
      ))}
    </div>
  ) : null;
};
