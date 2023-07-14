import { FC } from 'react';
import { useRecoilState } from 'recoil';
import state from '../../state/state';
import classNames from 'classnames';

export const CommonStatus: FC = () => {
  const [statusMessages, setStatusMessage] = useRecoilState(state.status.commonMessages);

  const deleteMessage = (messageId?: string) => {
    setStatusMessage(current => current.filter(({ id }) => id !== messageId));
  };

  return statusMessages?.length ? (
    <div>
      {statusMessages.map(({ id, type, message }) => (
        <div key={id} className={classNames(['status-message', type])}>
          {message} <button onClick={() => deleteMessage(id)}>x</button>
        </div>
      ))}
    </div>
  ) : null;
};
