import { FC, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import classNames from 'classnames';
import state from '@state';
import { FormattedMessage } from 'react-intl';

const DELETE_TIMEOUT = 5000;

export const CommonStatus: FC = () => {
  const [statusMessages, setStatusMessages] = useRecoilState(state.status.commonMessages);

  const deleteMessage = (messageId?: string) => {
    setStatusMessages(current => current.filter(({ id }) => id !== messageId));
  };

  const deleteOldestMessage = () => deleteMessage(statusMessages[0].id);

  useEffect(() => {
    if (!statusMessages.length) {
      return;
    }

    setTimeout(deleteOldestMessage, DELETE_TIMEOUT);
  }, [statusMessages]);

  return statusMessages?.length ? (
    <div className="common-status" data-testid="common-status">
      {statusMessages.map(({ id, type, message }) => (
        <div key={id} className={classNames(['status-message', type])}>
          <FormattedMessage id={message} defaultMessage={message} /> <button onClick={() => deleteMessage(id)}>x</button>
        </div>
      ))}
    </div>
  ) : null;
};
