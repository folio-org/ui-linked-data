import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { Dropdown } from '@components/Dropdown';
import { DropdownItemType } from '@common/constants/uiElements.constants';
import { ROUTES } from '@common/constants/routes.constants';
import Plus16 from '@src/assets/plus-16.svg?react';
import Compare from '@src/assets/compare.svg?react';
import './SearchControlPane.scss';

export const SearchControlPane = () => {
  const navigate = useNavigate();

  const items = [
    {
      id: 'actions',
      labelId: 'marva.actions',
      data: [
        {
          id: 'newResource',
          type: DropdownItemType.basic,
          labelId: 'marva.newResource',
          icon: <Plus16 />,
          action: () => {
            navigate(`${ROUTES.RESOURCE_CREATE.uri}?type=work`);
          },
        },
        {
          id: 'compare',
          type: DropdownItemType.basic,
          labelId: 'marva.compareSelected',
          icon: <Compare />,
          isDisabled: true,
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
      <div className="search-control-pane-title">
        <div className="search-control-pane-mainLabel">
          <FormattedMessage id={'marva.resources'} />
        </div>
        {/* <div className="search-control-pane-subLabel"></div> */}
      </div>
      <Dropdown labelId="marva.actions" items={items} />
    </div>
  );
};
