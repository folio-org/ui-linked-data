import { FC, ReactNode, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { DOM_ELEMENTS } from '@/common/constants/domElementsIdentifiers.constants';
import { Loading } from '@/components/Loading';
import { SearchEmptyPlaceholder } from '../SearchEmptyPlaceholder';
import { UserNotificationFactory } from '@/common/services/userNotification';
import { StatusType } from '@/common/constants/status.constants';
import { useStatusState } from '@/store';
import './SearchContentContainer.scss';
import { useSearchContext } from '../../providers';

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
  const { uiConfig, results, isLoading, isFetching, isError, error } = useSearchContext();
  const { addStatusMessagesItem } = useStatusState(['addStatusMessagesItem']);
  const isVisibleEmptySearchPlaceholder = uiConfig.features?.isVisibleEmptySearchPlaceholder;
  const emptyPlaceholderLabel = uiConfig.ui?.emptyStateId;
  const hasData = !!results?.items && results.items.length > 0;
  const showEmpty = !hasData && !message && isVisibleEmptySearchPlaceholder && !isLoading && !isFetching;
  const showLoading = isLoading || isFetching;

  // Show error notification when search fails
  useEffect(() => {
    if (isError && error) {
      console.error('Search error:', error);

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
      {!showLoading && hasData && children}
      {showEmpty && <SearchEmptyPlaceholder labelId={emptyPlaceholderLabel} className={emptyPlaceholderClassName} />}
    </div>
  );
};
