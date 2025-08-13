import { FC } from 'react';
import { DropdownItemType } from '@common/constants/uiElements.constants';
import { Dropdown } from '@components/Dropdown';
import { useNavigateToEditPage } from '@common/hooks/useNavigateToEditPage';
import { useNavigateToCreatePage } from '@common/hooks/useNavigateToCreatePage';
import { TYPE_URIS } from '@common/constants/bibframe.constants';
import Edit16 from '@src/assets/edit-16.svg?react';
import Duplicate16 from '@src/assets/duplicate-16.svg?react';
import Plus16 from '@src/assets/plus-16.svg?react';

type Props = {
  referenceId?: string | null;
  entityType?: string;
  ownId?: string;
  handleNavigateToEditPage?: VoidFunction;
};

export const PreviewActionsDropdown: FC<Props> = ({ referenceId, ownId, entityType, handleNavigateToEditPage }) => {
  const { navigateAsDuplicate } = useNavigateToEditPage();
  const { onCreateNewResource } = useNavigateToCreatePage();

  const handleDuplicate = () => ownId && navigateAsDuplicate(ownId);

  const handleClickNewInstance = () => {
    onCreateNewResource({
      resourceTypeURL: TYPE_URIS.INSTANCE as ResourceTypeURL,
      queryParams: {
        type: entityType,
        refId: referenceId,
      },
    });
  };

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
          action: handleClickNewInstance,
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
