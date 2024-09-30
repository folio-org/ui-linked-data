import { DropdownItemType } from '@common/constants/uiElements.constants';
import { Dropdown } from '@components/Dropdown';
import Edit16 from '@src/assets/edit-16.svg?react';
import Duplicate16 from '@src/assets/duplicate-16.svg?react';
import Plus16 from '@src/assets/plus-16.svg?react';
import { useNavigateToEditPage } from '@common/hooks/useNavigateToEditPage';
import { FC } from 'react';
import { QueryParams, ROUTES } from '@common/constants/routes.constants';

type Props = {
  referenceId?: string;
  entityType?: string;
  ownId?: string;
  handleNavigateToEditPage?: VoidFunction;
};

export const PreviewActionsDropdown: FC<Props> = ({ referenceId, ownId, entityType, handleNavigateToEditPage }) => {
  const { navigateToEditPage, navigateAsDuplicate } = useNavigateToEditPage();

  const handleDuplicate = () => ownId && navigateAsDuplicate(ownId);

  const actionDropdownItems = [
    {
      id: 'actions',
      labelId: 'ld.actions',
      data: [
        {
          id: 'edit',
          type: DropdownItemType.basic,
          labelId: 'ld.edit',
          icon: <Edit16 />,
          action: handleNavigateToEditPage,
        },
        {
          id: 'duplicate',
          type: DropdownItemType.basic,
          labelId: 'ld.duplicate',
          icon: <Duplicate16 />,
          action: handleDuplicate,
        },
        {
          id: 'newInstance',
          type: DropdownItemType.basic,
          labelId: 'ld.newInstance',
          icon: <Plus16 />,
          action: () =>
            entityType &&
            referenceId &&
            navigateToEditPage(
              `${ROUTES.RESOURCE_CREATE.uri}?${QueryParams.Type}=${entityType}&${QueryParams.Ref}=${referenceId}`,
            ),
        },
      ],
    },
  ];

  return (
    <Dropdown
      labelId="ld.actions"
      className="toggle-entity-edit"
      items={actionDropdownItems}
      hideLabelIdWithinDropdownList={true}
      buttonTestId="preview-actions-dropdown"
    />
  );
};
