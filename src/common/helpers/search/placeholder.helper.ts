import { SearchIdentifiers } from '@common/constants/search.constants';
import { SearchableIndex } from '@common/constants/complexLookup.constants';
import type { SelectValue } from '@components/Select';

type SearchOption = SearchIdentifiers | SelectValue | ComplexLookupSearchByValue[number];

export const getSearchPlaceholder = (
  selectOptions?: SearchOption[],
  searchBy?: SearchIdentifiers | SearchableIndex,
) => {
  if (!selectOptions || !Array.isArray(selectOptions)) {
    return '';
  }

  const currentOption = searchBy
    ? selectOptions.find(option => {
        if (typeof option === 'object' && 'value' in option) {
          return option.value === searchBy;
        }

        return option === searchBy;
      })
    : selectOptions[0];

  if (typeof currentOption === 'object' && currentOption && 'placeholder' in currentOption) {
    return currentOption.placeholder || '';
  }

  return '';
};
