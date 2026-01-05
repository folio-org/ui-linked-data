import { FC, ChangeEvent, FormEventHandler } from 'react';
import { useIntl } from 'react-intl';
import { Input } from '@/components/Input';
import { Textarea } from '@/components/Textarea';
import { useSearchState } from '@/store';
import { useSearchContext } from '../../providers/SearchProvider';
import { getSearchPlaceholder } from '../../utils';

interface QueryInputProps {
  placeholder?: string;
}

export const QueryInput: FC<QueryInputProps> = ({ placeholder }) => {
  const { formatMessage } = useIntl();
  const { config, activeUIConfig, onSubmit } = useSearchContext();
  const { query, setQuery, searchBy } = useSearchState(['query', 'setQuery', 'searchBy']);

  // Guard: Feature disabled
  if (!activeUIConfig.features?.hasQueryInput) {
    return null;
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setQuery(e.target.value);
  };

  const handleTextareaChange: FormEventHandler<HTMLTextAreaElement> = e => {
    setQuery(e.currentTarget.value);
  };

  const placeholderText =
    placeholder ??
    getSearchPlaceholder({
      searchBy,
      config,
      uiConfig: activeUIConfig,
      formatMessage,
    });
  const ariaLabel = formatMessage({ id: 'ld.aria.filters.textbox' });

  // Multiline mode
  if (activeUIConfig.features?.hasMultilineInput) {
    return (
      <Textarea
        id="id-search-textarea"
        className="select-textarea"
        value={query}
        onChange={handleTextareaChange}
        data-testid="id-search-textarea"
        fullWidth
        placeholder={placeholderText}
        ariaLabel={ariaLabel}
      />
    );
  }

  // Single-line mode
  return (
    <Input
      id="id-search-input"
      type="text"
      value={query}
      onChange={handleInputChange}
      className="text-input"
      onPressEnter={onSubmit}
      data-testid="id-search-input"
      placeholder={placeholderText}
      ariaLabel={ariaLabel}
    />
  );
};
