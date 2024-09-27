type DropdownItemType = keyof typeof import('@common/constants/uiElements.constants').DropdownItemType;
type SearchLimiterNames = `${import('@common/constants/search.constants').SearchLimiterNames}`;
type SearchLimiterNamesAuthority = `${import('@common/constants/search.constants').SearchLimiterNamesAuthority}`;
type FiltersGroupCheckType = `${import('@common/constants/search.constants').FiltersGroupCheckType}`;
type FiltersType = `${import('@common/constants/search.constants').FiltersType}`;
type ReactElement = import('react').ReactElement;

type DropdownItem = {
  id: string;
  type: DropdownItemType;
  isDisabled?: boolean;
  labelId?: string;
  icon?: ReactElement;
  action?: VoidFunction;
  hidden?: boolean;
  renderComponent?: (key: string | number) => ReactElement;
};

type DropdownGroup = {
  id: string;
  labelId: string;
  data: DropdownItem[];
};

type DropdownItems = DropdownGroup[];

type SearchItem = {
  id: string;
  type: FiltersType;
  name: SearchLimiterNames | SearchLimiterNamesAuthority;
  labelId: string;
};

type SearchGroup = {
  id?: string;
  labelId: string;
  type: FiltersGroupCheckType;
  children?: SearchItem[];
  facet?: string;
  isOpen?: boolean;
  hasExternalDataSource?: boolean;
  hasMappedSourceData?: boolean;
  excludedOptions?: string[];
};

type SearchFilters = SearchGroup[];
