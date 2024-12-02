import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { FormattedMessage } from 'react-intl';
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
import { getEditActionPrefix } from '@common/helpers/bibframe.helper';
import { useLoadingState, useMarcPreviewState, useStatusState } from '@src/store';
import state from '@state';
import EyeOpen16 from '@src/assets/eye-open-16.svg?react';
import ExternalLink16 from '@src/assets/external-link-16.svg?react';
import Duplicate16 from '@src/assets/duplicate-16.svg?react';
import Times16 from '@src/assets/times-16.svg?react';
import './EditControlPane.scss';

export const EditControlPane = () => {
  const isInCreateMode = useRoutePathPattern(RESOURCE_CREATE_URLS);
  const { isLoading } = useLoadingState();
  const currentlyEditedEntityBfid = useRecoilValue(state.ui.currentlyEditedEntityBfid);
  const { setRecordStatus } = useStatusState();
  const { setBasicValue } = useMarcPreviewState();
  const navigate = useNavigate();
  const searchResultsUri = useBackToSearchUri();
  const { resourceId } = useParams();
  const { navigateAsDuplicate } = useNavigateToEditPage();
  const [queryParams] = useSearchParams();
  const { fetchMarcData } = useMarcData(setBasicValue);

  const handleFetchMarcData = async () => fetchMarcData(resourceId);

  const handleDuplicate = () => resourceId && navigateAsDuplicate(resourceId);

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
