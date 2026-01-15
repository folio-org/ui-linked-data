import { DropdownItemType } from '@/common/constants/uiElements.constants';
import Plus16 from '@/assets/plus-16.svg?react';

export interface HubActionsParams {
  onClickNewHub: () => void;
}

export const createHubActionsConfig = ({ onClickNewHub }: HubActionsParams) => [
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
    ],
  },
];
