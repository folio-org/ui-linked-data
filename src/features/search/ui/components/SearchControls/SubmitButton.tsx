import { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, ButtonType } from '@/components/Button';
import { useSearchState } from '@/store';
import { useSearchControlsContext } from '../../providers/SearchControlsProvider';

export const SubmitButton: FC = () => {
  const { activeUIConfig, onSubmit } = useSearchControlsContext();
  const { query } = useSearchState(['query']);

  // Guard: Feature disabled
  if (!activeUIConfig.features?.hasSubmitButton) {
    return null;
  }

  return (
    <Button
      data-testid="id-search-button"
      type={ButtonType.Highlighted}
      className="search-button primary-search"
      onClick={onSubmit}
      disabled={!query}
    >
      <FormattedMessage id="ld.search" />
    </Button>
  );
};
