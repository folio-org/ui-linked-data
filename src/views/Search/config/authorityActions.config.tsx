import { DropdownItemType } from '@/common/constants/uiElements.constants';

import Plus16 from '@/assets/plus-16.svg?react';
import Settings from '@/assets/settings.svg?react';

export interface AuthorityActionsParams {
  onClickNewAuthority: () => void;
  navigateToManageProfileSettings: () => void;
}

export const createAuthorityActionsConfig = ({
  onClickNewAuthority,
  navigateToManageProfileSettings,
}: AuthorityActionsParams) => [
  {
    id: 'actions',
    labelId: 'ld.actions',
    data: [
      {
        id: 'newAuthority',
        type: DropdownItemType.basic,
        labelId: 'ld.newAuthority',
        icon: <Plus16 />,
        action: onClickNewAuthority,
      },
      {
        id: 'manageProfileSettings',
        type: DropdownItemType.basic,
        labelId: 'ld.manageProfileSettings',
        icon: <Settings />,
        action: navigateToManageProfileSettings,
      },
    ],
  },
];
