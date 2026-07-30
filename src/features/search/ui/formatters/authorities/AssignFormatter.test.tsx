import { fireEvent } from '@testing-library/dom';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';

import { AuthRefType } from '@/common/constants/search.constants';

import { AssignFormatter } from './AssignFormatter';

describe('AssignFormatter', () => {
  const mockOnAssign = jest.fn();
  const mockCheckFailedId = jest.fn();

  describe('Button', () => {
    const row = {
      authorized: { label: AuthRefType.Authorized },
      __meta: { id: '1' },
      title: { label: 'Title 1' },
      subclass: { label: 'Subclass 1' },
    };

    it('renders when authorized', () => {
      mockCheckFailedId.mockReturnValue(false);

      const { getByTestId } = render(
        AssignFormatter({ row, onAssign: mockOnAssign, checkFailedId: mockCheckFailedId }),
      );
      const button = getByTestId('assign-button-1');

      expect(button).toBeInTheDocument();

      fireEvent.click(button);

      expect(mockOnAssign).toHaveBeenCalledWith({
        id: '1',
        title: 'Title 1',
        linkedFieldValue: 'Subclass 1',
      });
    });

    it('renders disabled Button', () => {
      mockCheckFailedId.mockReturnValue(true);

      const { getByTestId } = render(
        AssignFormatter({ row, onAssign: mockOnAssign, checkFailedId: mockCheckFailedId }),
      );
      const button = getByTestId('assign-button-1');

      expect(button).toBeInTheDocument();
      expect(button).toBeDisabled();
    });
  });

  it('does not render Button when not authorized', () => {
    const row = {
      authorized: { label: AuthRefType.AuthRef },
      __meta: { id: '2' },
      title: { label: 'Title 2' },
      subclass: { label: 'Subclass 2' },
    };

    const { queryByTestId } = render(
      AssignFormatter({ row, onAssign: mockOnAssign, checkFailedId: mockCheckFailedId }),
    );

    expect(queryByTestId('assign-button-2')).toBeNull();
  });

  describe('accessibility', () => {
    const authorizedRow = {
      authorized: { label: AuthRefType.Authorized },
      __meta: { id: '1' },
      title: { label: 'Title 1' },
      subclass: { label: 'Subclass 1' },
    };
    const unauthorizedRow = {
      authorized: { label: AuthRefType.AuthRef },
      __meta: { id: '2' },
      title: { label: 'Title 2' },
      subclass: { label: 'Subclass 2' },
    };

    test.each([
      ['renders disabled Button', authorizedRow, true],
      ['does not render Button when not authorized', unauthorizedRow, false],
    ])('has no accessibility violations when %s', async (_description, testRow, checkFailedIdResult) => {
      mockCheckFailedId.mockReturnValue(checkFailedIdResult);

      const { container } = render(
        AssignFormatter({ row: testRow, onAssign: mockOnAssign, checkFailedId: mockCheckFailedId }),
      );

      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });
  });
});
