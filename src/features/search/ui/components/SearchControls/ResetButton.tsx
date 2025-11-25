import { FC } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button, ButtonType } from '@/components/Button';
import XInCircle from '@/assets/x-in-circle.svg?react';
import { useSearchState } from '@/store';
import { useSearchContext } from '../../providers/SearchProvider';

export const ResetButton: FC = () => {
  const { formatMessage } = useIntl();
  const { onReset } = useSearchContext();
  const { query } = useSearchState(['query']);

  const isDisabled = !query;

  return (
    <Button
      type={ButtonType.Text}
      className="search-button"
      onClick={onReset}
      prefix={<XInCircle />}
      disabled={isDisabled}
      data-testid="id-search-reset-button"
      ariaLabel={formatMessage({ id: 'ld.aria.filters.reset' })}
    >
      <FormattedMessage id="ld.reset" />
    </Button>
  );
};
