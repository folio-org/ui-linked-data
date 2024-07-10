import { DropdownItemType } from '@common/constants/uiElements.constants';
import { Dropdown } from '@components/Dropdown';
import Edit16 from '@src/assets/edit-16.svg?react';
import Duplicate16 from '@src/assets/duplicate-16.svg?react';
import Plus16 from '@src/assets/plus-16.svg?react';
import { useNavigateToEditPage } from '@common/hooks/useNavigateToEditPage';
import { FC } from 'react';
import { QueryParams, ROUTES } from '@common/constants/routes.constants';
import { useRecoilValue } from 'recoil';
import state from '@state';

type Props = {
  referenceId?: string;
  entityType?: string;
};

export const PreviewActionsDropdown: FC<Props> = ({ referenceId, entityType }) => {
  const { navigateToEditPage } = useNavigateToEditPage();
  const isEdited = useRecoilValue(state.status.recordIsEdited);
  const isEditedQueryParam = isEdited ? `&${QueryParams.PerformIdUpdate}=true` : '';

  const actionDropdownItems = [
    {
      id: 'actions',
      labelId: 'marva.actions',
      data: [
        {
          id: 'edit',
          type: DropdownItemType.basic,
          labelId: 'marva.edit',
          icon: <Edit16 />,
        },
        {
          id: 'duplicate',
          type: DropdownItemType.basic,
          labelId: 'marva.duplicate',
          icon: <Duplicate16 />,
        },
        {
          id: 'newInstance',
          type: DropdownItemType.basic,
          labelId: 'marva.newInstance',
          icon: <Plus16 />,
          action: () =>
            entityType &&
            referenceId &&
            navigateToEditPage(
              `${ROUTES.RESOURCE_CREATE.uri}?${QueryParams.Type}=${entityType}&${QueryParams.Ref}=${referenceId}${isEditedQueryParam}`,
            ),
        },
      ],
    },
  ];

  return (
    <Dropdown
      labelId="marva.actions"
      className="toggle-entity-edit"
      items={actionDropdownItems}
      hideLabelIdWithinDropdownList={true}
    />
  );
};
