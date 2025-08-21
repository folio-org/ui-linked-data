import { FC, memo, useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { getWarningByProfileNames } from '@common/helpers/profileSelection.helper';
import ErrorIcon from '@src/assets/exclamation-circle.svg?react';
import './ModalChooseProfile.scss';

interface WarningMessagesProps {
  profileSelectionType: ProfileSelectionType;
  profiles: ProfileDTO[];
  selectedProfileId?: string | number | null;
  selectedValue?: string | number;
}

export const WarningMessages: FC<WarningMessagesProps> = memo(
  ({ profileSelectionType, profiles, selectedProfileId, selectedValue }) => {
    const [warningMessages, setWarningMessages] = useState<string[] | null>(null);

    useEffect(() => {
      if (profileSelectionType.action === 'change' && selectedProfileId && selectedValue !== selectedProfileId) {
        const fromProfile = profiles.find(({ id }) => id == selectedProfileId);
        const toProfile = profiles.find(({ id }) => id == selectedValue);

        if (fromProfile?.name && toProfile?.name) {
          const messages = getWarningByProfileNames(fromProfile.name, toProfile.name);

          setWarningMessages(messages);
        }
      } else {
        setWarningMessages(null);
      }
    }, [selectedValue, selectedProfileId, profileSelectionType.action, profiles]);

    const hasWarningMessages = Boolean(warningMessages && warningMessages.length > 0);

    return hasWarningMessages ? (
      <div className="modal-content-warning">
        <div className="warning-message">
          <div className="warning-title">
            <ErrorIcon className="icon" />
            <h4 className="warning-title-text">
              <FormattedMessage id="ld.modal.chooseResourceProfile.warningTitle" />
            </h4>
          </div>
          <ul className="warning-content">
            {warningMessages?.map((message, index) => (
              <li key={`warning-item-${message}-${index}`}>
                <FormattedMessage id={message} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    ) : null;
  },
);
