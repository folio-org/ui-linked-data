import React, { FC, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';

import classNames from 'classnames';

import { StatusType } from '@/common/constants/status.constants';
import { Button, ButtonType } from '@/components/Button';

import { useStatusState } from '@/store';

import CheckCircleIcon from '@/assets/check-circle.svg?react';
import ErrorIcon from '@/assets/exclamation-circle.svg?react';
import WarningIcon from '@/assets/exclamation-triangle.svg?react';
import CloseIcon from '@/assets/times-16.svg?react';

import './CommonStatus.scss';

export const CommonStatus: FC = () => {
  const location = useLocation();
  const { formatMessage } = useIntl();
  const { statusMessages, setStatusMessages } = useStatusState(['statusMessages', 'setStatusMessages']);

  useEffect(() => {
    setStatusMessages([]);
  }, [location.pathname]);

  const deleteMessage = (messageId?: string) => {
    setStatusMessages(prev => prev.filter(({ id }) => id !== messageId));
  };

  const messageInlineStyle = (index: number) => {
    const finalY = -25 * index + '%';
    const finalX = -2 * index + '%';
    return {
      transform: `translate(${finalX}, ${finalY})`,
      animationFillMode: 'forwards',
      '--final-x': finalX,
    } as React.CSSProperties;
  };

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
    <section
      className="common-status"
      data-testid="common-status"
      aria-label={formatMessage({ id: 'ld.aria.notifications' })}
    >
      {statusMessages.map(({ id, type, message }, idx) => (
        <div key={id} className={classNames(['status-message', type])} role="status" style={messageInlineStyle(idx)}>
          {renderIcon(type as StatusType)}
          <span className="status-message-text">
            <FormattedMessage id={message as string} defaultMessage={message as string} />
          </span>
          <Button className="status-message-close" type={ButtonType.Icon} onClick={() => deleteMessage(id)}>
            <CloseIcon />
          </Button>
        </div>
      ))}
    </section>
  ) : null;
};
