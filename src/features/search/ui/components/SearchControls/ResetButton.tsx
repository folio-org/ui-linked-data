import { FC } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSearchParams } from 'react-router-dom';

import { Button, ButtonType } from '@/components/Button';

import { SearchParam } from '@/features/search/core';

import { useSearchState } from '@/store';

import XInCircle from '@/assets/x-in-circle.svg?react';

import { useSearchContext } from '../../providers/SearchProvider';

export const ResetButton: FC = () => {
  const { formatMessage } = useIntl();
  const [searchParams] = useSearchParams();
  const { onReset } = useSearchContext();
  const { query } = useSearchState(['query']);

  const isAdvancedSearch = !!searchParams.get(SearchParam.QUERY) && !searchParams.get(SearchParam.SEARCH_BY);
  const isDisabled = !query && !isAdvancedSearch;

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
