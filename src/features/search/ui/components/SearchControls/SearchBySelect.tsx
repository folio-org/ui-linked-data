import { FC } from 'react';
import { useIntl } from 'react-intl';
import { Select, type SelectValue } from '@/components/Select';
import { useSearchControlsContext } from '../../providers/SearchControlsProvider';

export const SearchBySelect: FC = () => {
  const { formatMessage } = useIntl();
  const { config, activeUIConfig, searchBy, onSearchByChange } = useSearchControlsContext();

  // Guard: Feature disabled
  if (!activeUIConfig.features?.hasSearchBy) {
    return null;
  }

  // Get searchable indices from config
  const searchableIndices = config.searchBy?.searchableIndices || [];

  // Guard: No options
  if (searchableIndices.length === 0) {
    return null;
  }

  // Convert to SelectValue format
  const options: SelectValue[] = searchableIndices.map(index => ({
    value: index.value,
    label: index.value, // Will be formatted by Select with withIntl
  }));

  const handleChange = ({ value }: SelectValue) => {
    onSearchByChange(value as string);
  };

  return (
    <Select
      withIntl
      id="id-search-select"
      data-testid="id-search-select"
      className="select-input"
      value={searchBy}
      options={options}
      onChange={handleChange}
      ariaLabel={formatMessage({ id: 'ld.aria.filters.select' })}
    />
  );
};
