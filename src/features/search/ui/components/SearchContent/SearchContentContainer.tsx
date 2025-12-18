import { FC, ReactNode, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { logger } from '@/common/services/logger';
import { DOM_ELEMENTS } from '@/common/constants/domElementsIdentifiers.constants';
import { Loading } from '@/components/Loading';
import { SearchEmptyPlaceholder } from '../SearchEmptyPlaceholder';
import { UserNotificationFactory } from '@/common/services/userNotification';
import { StatusType } from '@/common/constants/status.constants';
import { useStatusState } from '@/store';
import './SearchContentContainer.scss';
import { useSearchContext } from '../../providers';
import { useCommittedSearchParams } from '../../hooks';

interface SearchContentContainerProps {
  children?: ReactNode;
  message?: string;
  emptyPlaceholderClassName?: string;
}

export const SearchContentContainer: FC<SearchContentContainerProps> = ({
  children,
  message,
  emptyPlaceholderClassName,
}) => {
  const { uiConfig, results, isLoading, isFetching, isError, error, flow } = useSearchContext();
  const { addStatusMessagesItem } = useStatusState(['addStatusMessagesItem']);
  const committed = useCommittedSearchParams({ flow });
  const isVisibleEmptySearchPlaceholder = uiConfig.features?.isVisibleEmptySearchPlaceholder;
  const emptyPlaceholderLabel = uiConfig.ui?.emptyStateId;
  const noResultsLabel = uiConfig.ui?.noResultsId;
  const hasData = !!results?.items && results.items.length > 0;

  // Check if there's a valid committed query (works for both flows)
  const hasQuery = !!committed.query && committed.query.trim() !== '';

  // Show empty placeholder when no query is committed
  const showEmpty = !hasQuery && !message && isVisibleEmptySearchPlaceholder && !isLoading && !isFetching;

  // Show no results when query exists but returned empty data
  const showNoResults = hasQuery && !hasData && !message && !isLoading && !isFetching;

  const showResults = hasData;
  const showLoading = isLoading || isFetching;

  // Show error notification when search fails
  useEffect(() => {
    if (isError && error) {
      logger.error('Search error:', error);

      addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.error, 'ld.errorFetching'));
    }
  }, [isError, error]);

  return (
    <div className={DOM_ELEMENTS.classNames.itemSearchContentContainer}>
      {message && (
        <div className={DOM_ELEMENTS.classNames.itemSearchMessage}>
          <FormattedMessage id={message} />
        </div>
      )}
      {showLoading && <Loading />}
      {!showLoading && showResults && children}
      {showEmpty && <SearchEmptyPlaceholder labelId={emptyPlaceholderLabel} className={emptyPlaceholderClassName} />}
      {showNoResults && <SearchEmptyPlaceholder labelId={noResultsLabel} className={emptyPlaceholderClassName} />}
    </div>
  );
};
