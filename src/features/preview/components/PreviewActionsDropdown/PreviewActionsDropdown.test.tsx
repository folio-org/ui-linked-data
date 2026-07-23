import { onCreateNewResource } from '@/test/__mocks__/common/hooks/useNavigateToCreatePage.mock';

import { BrowserRouter } from 'react-router-dom';

import { fireEvent, render } from '@testing-library/react';
import { axe } from 'jest-axe';

import { PreviewActionsDropdown } from './PreviewActionsDropdown';

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

  describe('accessibility', () => {
    test('has no accessibility violations', async () => {
      const { container } = render(
        <BrowserRouter>
          <PreviewActionsDropdown entityType={entityType} referenceId={referenceId} />
        </BrowserRouter>,
      );

      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });
  });
});
