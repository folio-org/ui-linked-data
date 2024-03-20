import { Dropdown } from '@components/Dropdown';
import { DropdownItemType } from '@common/constants/uiElements.constants';
import Plus16 from '@src/assets/plus-16.svg?react';
import Compare from '@src/assets/compare.svg?react';
import './SearchControlPane.scss';

export const SearchControlPane = () => {
  const data = [
    {
      id: 'actions',
      labelId: 'marva.actions',
      data: [
        {
          id: 'newResource',
          type: DropdownItemType.basic,
          labelId: 'marva.newResource',
          icon: <Plus16 />,
          action: () => {},
        },
        {
          id: 'compare',
          type: DropdownItemType.basic,
          labelId: 'marva.compareSelected',
          icon: <Compare />,
          isDisabled: true,
          action: () => {},
        },
      ],
    },
    // Example of the dropdown option with a custom component instead of the standart button
    /* {
      id: 'sortBy',
      labelId: 'marva.newResource',
      data: [
        {
          id: 'sortBy',
          type: DropdownItemType.customComponent,
          renderComponent: (key: string | number) => <div key={key}>Custom</div>,
        },
      ],
    }, */
  ];

  return (
    <div className="search-control-pane">
      <Dropdown labelId="marva.actions" data={data} />
    </div>
  );
};
