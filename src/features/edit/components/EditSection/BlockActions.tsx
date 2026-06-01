import { FC } from 'react';
import { useParams } from 'react-router-dom';

import { PROFILE_BFIDS } from '@/common/constants/bibframe.constants';
import { BFLITE_URIS } from '@/common/constants/bibframeMapping.constants';
import { IS_DISABLED_FOR_ALPHA } from '@/common/constants/feature.constants';
import { INVENTORY_VIEW_URL, RESOURCE_CREATE_URLS } from '@/common/constants/routes.constants';
import { DropdownItemType } from '@/common/constants/uiElements.constants';
import { useNavigateToEditPage } from '@/common/hooks/useNavigateToEditPage';
import { useRoutePathPattern } from '@/common/hooks/useRoutePathPattern';
import { Dropdown } from '@/components/Dropdown';

import { useResourceExport } from '@/features/edit';
import { useProfileSelection } from '@/features/profiles';
import { useMarcData } from '@/features/resources';

import { useInputsState, useMarcPreviewState } from '@/store';

import Download16 from '@/assets/download-16.svg?react';
import Duplicate16 from '@/assets/duplicate-16.svg?react';
import ExternalLink16 from '@/assets/external-link-16.svg?react';
import EyeOpen16 from '@/assets/eye-open-16.svg?react';
import Settings from '@/assets/settings.svg?react';

type BlockActionsProps = {
  entry: SchemaEntry;
};

export const BlockActions: FC<BlockActionsProps> = ({ entry }) => {
  const isInCreateMode = useRoutePathPattern(RESOURCE_CREATE_URLS);
  const { resourceId } = useParams();
  const { setBasicValue } = useMarcPreviewState(['setBasicValue']);
  const { navigateAsDuplicate } = useNavigateToEditPage();
  const { fetchMarcData } = useMarcData(setBasicValue);
  const { exportInstanceRdf } = useResourceExport();
  const { openModalForProfileChange } = useProfileSelection();
  const { selectedRecordBlocks, record } = useInputsState(['selectedRecordBlocks', 'record']);

  if (isInCreateMode) return null;

  const isInstance = entry.bfid === PROFILE_BFIDS.INSTANCE;
  const isWork = entry.bfid === PROFILE_BFIDS.WORK;
  const inventoryId = (record?.resource?.[BFLITE_URIS.INSTANCE] as Record<string, unknown>)?.folioMetadata as
    | Record<string, string>
    | undefined;
  const inventoryViewId = inventoryId?.inventoryId;

  const handleDuplicate = () => {
    if (resourceId) {
      navigateAsDuplicate(resourceId);
    }
  };

  const handleFetchMarcData = async () => fetchMarcData(resourceId);

  const viewInInventary = () => {
    if (inventoryViewId) {
      globalThis.location.assign(`${INVENTORY_VIEW_URL}/${inventoryViewId}`);
    }
  };

  const handleExportInstanceRdf = () => {
    if (resourceId) {
      exportInstanceRdf(resourceId);
    }
  };

  const handleChangeProfile = () => {
    if (!resourceId) return;

    openModalForProfileChange({ resourceTypeURL: selectedRecordBlocks?.block as ResourceTypeURL });
  };

  const items = [
    {
      id: 'actions',
      labelId: 'ld.actions',
      data: [
        {
          id: 'duplicate',
          type: DropdownItemType.basic,
          labelId: 'ld.duplicate',
          icon: <Duplicate16 />,
          action: handleDuplicate,
        },
        {
          id: 'viewLinkedData',
          type: DropdownItemType.basic,
          labelId: 'ld.viewLinkedData',
          icon: <EyeOpen16 />,
          isDisabled: IS_DISABLED_FOR_ALPHA,
          hidden: true,
        },
        {
          id: 'viewMarc',
          type: DropdownItemType.basic,
          labelId: 'ld.viewMarc',
          icon: <EyeOpen16 />,
          hidden: !isInstance,
          action: handleFetchMarcData,
        },
        {
          id: 'inventoryView',
          type: DropdownItemType.basic,
          labelId: 'ld.inventoryView',
          icon: <ExternalLink16 />,
          hidden: !isInstance,
          isDisabled: !inventoryViewId,
          action: viewInInventary,
        },
        {
          id: 'exportInstanceRdf',
          type: DropdownItemType.basic,
          labelId: 'ld.exportInstanceRdf',
          icon: <Download16 />,
          hidden: !isInstance,
          action: handleExportInstanceRdf,
        },
        {
          id: 'changeWorkProfile',
          type: DropdownItemType.basic,
          labelId: 'ld.changeWorkProfile',
          icon: <Settings />,
          hidden: !isWork,
          action: handleChangeProfile,
        },
        {
          id: 'changeInstanceProfile',
          type: DropdownItemType.basic,
          labelId: 'ld.changeInstanceProfile',
          icon: <Settings />,
          hidden: !isInstance,
          action: handleChangeProfile,
        },
      ],
    },
  ];

  return <Dropdown labelId="ld.actions" items={items} buttonTestId={`block-actions-toggle`} />;
};
