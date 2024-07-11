import '@src/test/__mocks__/common/hooks/useNavigateToEditPage.mock';
import { navigateToEditPage } from '@src/test/__mocks__/common/hooks/useNavigateToEditPage.mock';
import { fireEvent, render } from '@testing-library/react';
import { PreviewActionsDropdown } from '@components/PreviewActionsDropdown';
import { RecoilRoot } from 'recoil';

describe('PreviewActionsDropdown', () => {
  const entityType = 'mockEntityType';
  const referenceId = 'mockReferenceId';

  it('navigates to edit page', () => {
    const { getByRole, getByText } = render(
      <RecoilRoot>
        <PreviewActionsDropdown entityType={entityType} referenceId={referenceId} />
      </RecoilRoot>,
    );

    fireEvent.click(getByRole('button'));
    fireEvent.click(getByText('marva.newInstance'));

    expect(navigateToEditPage).toHaveBeenCalled();
  });
});
