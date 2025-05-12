import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

type CompletedProps = {
  isImportSuccessful: boolean;
};

export const Completed: FC<CompletedProps> = ({ isImportSuccessful }) => {
  return (
    <div className="completed">
      {isImportSuccessful ? (
        <FormattedMessage id="ld.importFileSuccess" />
      ) : (
        <FormattedMessage id="ld.importFileFailure" />
      )}
    </div>
  );
};
