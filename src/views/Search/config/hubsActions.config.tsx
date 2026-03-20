import { DropdownItemType } from '@/common/constants/uiElements.constants';

import Lightning16 from '@/assets/lightning-16.svg?react';
import Plus16 from '@/assets/plus-16.svg?react';
import Settings from '@/assets/settings.svg?react';

export interface HubActionsParams {
  onClickNewHub: () => void;
  handleImportHubs: () => void;
  navigateToManageProfileSettings: () => void;
}

export const createHubActionsConfig = ({
  onClickNewHub,
  handleImportHubs,
  navigateToManageProfileSettings,
}: HubActionsParams) => [
  {
    id: 'actions',
    labelId: 'ld.actions',
    data: [
      {
        id: 'newHub',
        type: DropdownItemType.basic,
        labelId: 'ld.newHub',
        icon: <Plus16 />,
        action: onClickNewHub,
      },
      {
        id: 'importHub',
        type: DropdownItemType.basic,
        labelId: 'ld.importHubs',
        icon: <Lightning16 />,
        action: handleImportHubs,
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
