import { DropdownItemType } from '@/common/constants/uiElements.constants';
import { MIN_AMT_OF_INSTANCES_TO_COMPARE } from '@/common/constants/search.constants';
import Plus16 from '@/assets/plus-16.svg?react';
import Transfer16 from '@/assets/transfer-16.svg?react';
import Lightning16 from '@/assets/lightning-16.svg?react';

export interface ResourceActionsParams {
  onClickNewWork: () => void;
  handlePreviewMultiple: () => void | Promise<void>;
  handleImport: () => void;
  selectedInstancesCount: number;
}

export const createResourceActionsConfig = ({
  onClickNewWork,
  handlePreviewMultiple,
  handleImport,
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
    ],
  },
];
