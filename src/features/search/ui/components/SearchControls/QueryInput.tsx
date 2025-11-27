import { FC, ChangeEvent, FormEventHandler } from 'react';
import { useIntl } from 'react-intl';
import { Input } from '@/components/Input';
import { Textarea } from '@/components/Textarea';
import { useSearchState } from '@/store';
import { useSearchContext } from '../../providers/SearchProvider';

export const QueryInput: FC = () => {
  const { formatMessage } = useIntl();
  const { activeUIConfig, onSubmit } = useSearchContext();
  const { query, setQuery } = useSearchState(['query', 'setQuery']);

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

  const placeholderId = activeUIConfig.ui?.placeholderId;
  const placeholderText = placeholderId ? formatMessage({ id: placeholderId }) : undefined;
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
