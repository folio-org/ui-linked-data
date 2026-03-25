import React, { FC, useEffect, useRef } from 'react';
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

// In order to display a staircase effect for successive toasts,
// translate each new one according to these step values as
// percentages of the total toast size. Note that widespread
// adoption of CSS sibling-index() would allow this to be
// defined in a stylesheet instead. Without it, programmatic
// definition is needed.
const STAGGER_Y = -25;
const STAGGER_X = -2;

const messageInlineStyle = (index: number) => {
  const finalY = STAGGER_X * index + '%';
  const finalX = STAGGER_Y * index + '%';
  return {
    transform: `translate(${finalX}, ${finalY})`,
    animationFillMode: 'forwards',
    '--final-x': finalX,
  } as React.CSSProperties;
};

export const CommonStatus: FC = () => {
  const location = useLocation();
  const previousPath = useRef(location.pathname);
  const { formatMessage } = useIntl();
  const { statusMessages, setStatusMessages } = useStatusState(['statusMessages', 'setStatusMessages']);

  useEffect(() => {
    if (previousPath.current !== location.pathname) {
      setStatusMessages([]);
    }
    previousPath.current = location.pathname;
  }, [location.pathname]);

  const deleteMessage = (messageId?: string) => {
    setStatusMessages(prev => prev.filter(({ id }) => id !== messageId));
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
        <output key={id} className={classNames(['status-message', type])} style={messageInlineStyle(idx)}>
          {renderIcon(type as StatusType)}
          <span className="status-message-text">
            <FormattedMessage id={message as string} defaultMessage={message as string} />
          </span>
          <Button className="status-message-close" type={ButtonType.Icon} onClick={() => deleteMessage(id)}>
            <CloseIcon />
          </Button>
        </output>
      ))}
    </section>
  ) : null;
};
