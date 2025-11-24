import { FC } from 'react';
import { useIntl } from 'react-intl';
import { Select, type SelectValue } from '@/components/Select';
import { useSearchState } from '@/store';
import { useSearchControlsContext } from '../../providers/SearchControlsProvider';

export const SearchBySelect: FC = () => {
  const { formatMessage } = useIntl();
  const { config, activeUIConfig } = useSearchControlsContext();
  const { searchBy, setSearchBy } = useSearchState(['searchBy', 'setSearchBy']);

  // Guard: Feature disabled
  if (!activeUIConfig.features?.hasSearchBy) {
    return null;
  }

  const searchableIndices = config.searchBy?.searchableIndices || [];

  // Guard: No options
  if (searchableIndices.length === 0) {
    return null;
  }

  const options: SelectValue[] = searchableIndices.map(index => ({
    value: index.value,
    label: index.value, // Will be formatted by Select with withIntl
  }));

  const handleChange = ({ value }: SelectValue) => {
    setSearchBy(value);
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
