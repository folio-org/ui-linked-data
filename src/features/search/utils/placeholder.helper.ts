import { SearchIdentifiers } from '@common/constants/search.constants';
import { SearchableIndex } from '@common/constants/complexLookup.constants';
import { PROPERTIES_FROM_FOLIO } from '@common/constants/bibframe.constants';
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

export const getPlaceholderForProperty = (uri?: string) => {
  let placeholder;

  for (const property of PROPERTIES_FROM_FOLIO) {
    if (uri === property) {
      placeholder = 'ld.placeholder.processing';
    }
  }

  return placeholder;
};
