import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import { AuthRefType } from '@common/constants/search.constants';
import { AssignFormatter } from '@components/ComplexLookupField/formatters';

describe('AssignFormatter', () => {
  it('renders Button when authorized', () => {
    const mockOnAssign = jest.fn();
    const row = {
      authorized: { label: AuthRefType.Authorized },
      __meta: { id: '1' },
      title: { label: 'Title 1' },
      subclass: { label: 'Subclass 1' },
    };

    const { getByTestId } = render(AssignFormatter({ row, onAssign: mockOnAssign }));
    const button = getByTestId('assign-button-1');

    expect(button).toBeInTheDocument();

    fireEvent.click(button);

    expect(mockOnAssign).toHaveBeenCalledWith({
      id: '1',
      title: 'Title 1',
      linkedFieldValue: 'Subclass 1',
    });
  });

  it('does not render Button when not authorized', () => {
    const mockOnAssign = jest.fn();
    const row = {
      authorized: { label: AuthRefType.AuthRef },
      __meta: { id: '2' },
      title: { label: 'Title 2' },
      subclass: { label: 'Subclass 2' },
    };

    const { queryByTestId } = render(AssignFormatter({ row, onAssign: mockOnAssign }));

    expect(queryByTestId('assign-button-2')).toBeNull();
  });
});
