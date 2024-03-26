type DropdownItemType = keyof typeof import('@common/constants/uiElements.constants').DropdownItemType;
type ReactElement = import('react').ReactElement;

type DropdownItem = {
  id: string;
  type: DropdownItemType;
  isDisabled?: boolean;
  labelId?: string;
  icon?: ReactElement;
  action?: VoidFunction;
  renderComponent?: (key: string | number) => ReactElement;
};

type DropdownGroup = {
  id: string;
  labelId: string;
  data: DropdownItem[];
};

type DropdownItems = DropdownGroup[];
