import { navigateToEditPage } from '@src/test/__mocks__/common/hooks/useNavigateToEditPage.mock';
import { fireEvent, render } from '@testing-library/react';
import { PreviewActionsDropdown } from '@components/PreviewActionsDropdown';

describe('PreviewActionsDropdown', () => {
  const entityType = 'mockEntityType';
  const referenceId = 'mockReferenceId';

  it('navigates to edit page', () => {
    const { getByRole, getByText } = render(
      <PreviewActionsDropdown entityType={entityType} referenceId={referenceId} />,
    );

    fireEvent.click(getByRole('button'));
    fireEvent.click(getByText('ld.newInstance'));

    expect(navigateToEditPage).toHaveBeenCalled();
  });
});
