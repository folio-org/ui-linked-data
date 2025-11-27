import { FC, ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import { DOM_ELEMENTS } from '@/common/constants/domElementsIdentifiers.constants';
import { SearchEmptyPlaceholder } from '../SearchEmptyPlaceholder';
import { useSearchState } from '@/store';
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
  const { uiConfig } = useSearchContext();
  const isVisibleEmptySearchPlaceholder = uiConfig.features?.isVisibleEmptySearchPlaceholder;
  const emptyPlaceholderLabel = uiConfig.ui?.emptyStateId;
  const { data } = useSearchState(['data']);
  const hasData = !!data;
  const showEmpty = !hasData && !message && isVisibleEmptySearchPlaceholder;

  return (
    <div className={DOM_ELEMENTS.classNames.itemSearchContentContainer}>
      {message && (
        <div className={DOM_ELEMENTS.classNames.itemSearchMessage}>
          <FormattedMessage id={message} />
        </div>
      )}
      {hasData && children}
      {showEmpty && <SearchEmptyPlaceholder labelId={emptyPlaceholderLabel} className={emptyPlaceholderClassName} />}
    </div>
  );
};
