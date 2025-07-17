import { onCreateNewResource } from '@src/test/__mocks__/common/hooks/useNavigateToCreatePage.mock';
import { fireEvent, render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { PreviewActionsDropdown } from '@components/PreviewActionsDropdown';

describe('PreviewActionsDropdown', () => {
  const entityType = 'mockEntityType';
  const referenceId = 'mockReferenceId';

  it('creates a new instance', () => {
    const { getByRole, getByText } = render(
      <BrowserRouter>
        <PreviewActionsDropdown entityType={entityType} referenceId={referenceId} />
      </BrowserRouter>,
    );

    fireEvent.click(getByRole('button'));
    fireEvent.click(getByText('ld.newInstance'));

    expect(onCreateNewResource).toHaveBeenCalledWith({
      resourceTypeURL: expect.any(String),
      queryParams: {
        type: entityType,
        refId: referenceId,
      },
    });
  });
});
