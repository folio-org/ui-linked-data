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
  const hasQuery = flow === 'value' ? !!committed.query : true; // For value flow, check if there's a committed query
  const showEmpty = !hasQuery && !message && isVisibleEmptySearchPlaceholder && !isLoading && !isFetching; // Only show empty when no query
  const showNoResults = hasQuery && !hasData && !message && !isLoading && !isFetching; // Show no results when query exists but no data
  const showResults = hasData && hasQuery;
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
