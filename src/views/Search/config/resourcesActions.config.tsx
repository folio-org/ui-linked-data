import { DropdownItemType } from '@/common/constants/uiElements.constants';
import { MIN_AMT_OF_INSTANCES_TO_COMPARE } from '@/common/constants/search.constants';
import Plus16 from '@/assets/plus-16.svg?react';
import Transfer16 from '@/assets/transfer-16.svg?react';
import Lightning16 from '@/assets/lightning-16.svg?react';
import Settings from '@/assets/settings.svg?react';

export interface ResourceActionsParams {
  onClickNewWork: () => void;
  handlePreviewMultiple: () => void | Promise<void>;
  handleImport: () => void;
  navigateToManageProfileSettings: () => void;
  selectedInstancesCount: number;
}

export const createResourceActionsConfig = ({
  onClickNewWork,
  handlePreviewMultiple,
  handleImport,
  navigateToManageProfileSettings,
  selectedInstancesCount,
}: ResourceActionsParams) => [
  {
    id: 'actions',
    labelId: 'ld.actions',
    data: [
      {
        id: 'newResource',
        type: DropdownItemType.basic,
        labelId: 'ld.newResource',
        icon: <Plus16 />,
        action: onClickNewWork,
      },
      {
        id: 'compare',
        type: DropdownItemType.basic,
        labelId: 'ld.compareSelected',
        icon: <Transfer16 />,
        hidden: selectedInstancesCount < MIN_AMT_OF_INSTANCES_TO_COMPARE,
        action: handlePreviewMultiple,
      },
      {
        id: 'import',
        type: DropdownItemType.basic,
        labelId: 'ld.importInstances',
        icon: <Lightning16 />,
        action: handleImport,
      },
      {
        id: 'manageProfileSettings',
        type: DropdownItemType.basic,
        labelId: 'ld.manageProfileSettings',
        icon: <Settings />,
        action: navigateToManageProfileSettings,
      },
      // Example of the dropdown option with a custom component instead of the standard button
      /* {
      id: 'sortBy',
      labelId: 'ld.newResource',
      data: [
        {
          id: 'sortBy',
          type: DropdownItemType.customComponent,
          renderComponent: (key: string | number) => <div key={key}>Custom</div>,
        },
      ],
    }, */
    ],
  },
];
