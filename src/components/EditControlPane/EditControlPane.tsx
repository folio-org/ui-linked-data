import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { Dropdown } from '@components/Dropdown';
import { DropdownItemType } from '@common/constants/uiElements.constants';
import { RESOURCE_CREATE_URLS } from '@common/constants/routes.constants';
import { RESOURCE_TEMPLATE_IDS, PROFILE_BFIDS } from '@common/constants/bibframe.constants';
import { RecordStatus } from '@common/constants/record.constants';
import { IS_DISABLED_FOR_ALPHA } from '@common/constants/feature.constants';
import { Button, ButtonType } from '@components/Button';
import { useBackToSearchUri } from '@common/hooks/useBackToSearchUri';
import { useRoutePathPattern } from '@common/hooks/useRoutePathPattern';
import { useNavigateToEditPage } from '@common/hooks/useNavigateToEditPage';
import { useMarcData } from '@common/hooks/useMarcData';
import { useResourceExport } from '@common/hooks/useResourceExport';
import { useProfileSelection } from '@common/hooks/useProfileSelection';
import { getEditActionPrefix } from '@common/helpers/bibframe.helper';
import { useInputsState, useLoadingState, useMarcPreviewState, useStatusState, useUIState } from '@src/store';
import EyeOpen16 from '@src/assets/eye-open-16.svg?react';
import ExternalLink16 from '@src/assets/external-link-16.svg?react';
import Download16 from '@src/assets/download-16.svg?react';
import Duplicate16 from '@src/assets/duplicate-16.svg?react';
import Times16 from '@src/assets/times-16.svg?react';
import Settings from '@src/assets/settings.svg?react';
import './EditControlPane.scss';

export const EditControlPane = () => {
  const isInCreateMode = useRoutePathPattern(RESOURCE_CREATE_URLS);
  const { isLoading } = useLoadingState(['isLoading']);
  const { currentlyEditedEntityBfid } = useUIState(['currentlyEditedEntityBfid']);
  const { setRecordStatus } = useStatusState(['setRecordStatus']);
  const { setBasicValue } = useMarcPreviewState(['setBasicValue']);
  const navigate = useNavigate();
  const searchResultsUri = useBackToSearchUri();
  const { resourceId } = useParams();
  const { navigateAsDuplicate } = useNavigateToEditPage();
  const [queryParams] = useSearchParams();
  const { fetchMarcData } = useMarcData(setBasicValue);
  const { formatMessage } = useIntl();
  const { exportInstanceRdf } = useResourceExport();
  const { openModalForProfileChange } = useProfileSelection();
  const { selectedRecordBlocks } = useInputsState(['selectedRecordBlocks']);

  const handleFetchMarcData = async () => fetchMarcData(resourceId);

  const handleDuplicate = () => {
    if (resourceId) {
      navigateAsDuplicate(resourceId);
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
          hidden: !currentlyEditedEntityBfid.has(PROFILE_BFIDS.INSTANCE),
          action: handleFetchMarcData,
        },
        {
          id: 'viewInInventory',
          type: DropdownItemType.basic,
          labelId: 'ld.viewInInventory',
          icon: <ExternalLink16 />,
          isDisabled: IS_DISABLED_FOR_ALPHA,
          hidden: true,
        },
        {
          id: 'exportInstanceRdf',
          type: DropdownItemType.basic,
          labelId: 'ld.exportInstanceRdf',
          icon: <Download16 />,
          hidden: !currentlyEditedEntityBfid.has(PROFILE_BFIDS.INSTANCE),
          action: handleExportInstanceRdf,
        },
        {
          id: 'changeWorkProfile',
          type: DropdownItemType.basic,
          labelId: 'ld.changeWorkProfile',
          icon: <Settings />,
          hidden: !currentlyEditedEntityBfid.has(PROFILE_BFIDS.WORK),
          action: handleChangeProfile,
        },
        {
          id: 'changeInstanceProfile',
          type: DropdownItemType.basic,
          labelId: 'ld.changeInstanceProfile',
          icon: <Settings />,
          hidden: !currentlyEditedEntityBfid.has(PROFILE_BFIDS.INSTANCE),
          action: handleChangeProfile,
        },
      ],
    },
  ];

  return (
    <div className="nav-block nav-block-fixed-height">
      <nav>
        <Button
          data-testid="nav-close-button"
          type={ButtonType.Icon}
          onClick={() => {
            setRecordStatus({ type: RecordStatus.saveAndClose });
            navigate(searchResultsUri);
          }}
          className="nav-close"
          ariaLabel={formatMessage({ id: 'ld.aria.edit.close' })}
        >
          <Times16 />
        </Button>
      </nav>
      <div className="heading">
        {!isLoading &&
          Array.from(currentlyEditedEntityBfid).map(bfid => (
            <FormattedMessage
              key={bfid}
              id={`ld.${getEditActionPrefix(isInCreateMode, queryParams)}${RESOURCE_TEMPLATE_IDS[bfid]}`}
            />
          ))}
      </div>
      {!isInCreateMode ? (
        <Dropdown labelId="ld.actions" items={items} buttonTestId="edit-control-actions-toggle" />
      ) : (
        <span className="empty-block" />
      )}
    </div>
  );
};
