import { render, fireEvent } from '@testing-library/react';
import { ComplexLookupSelectedItem } from './ComplexLookupSelectedItem';

jest.mock('@common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: false }));

describe('ComplexLookupSelectedItem', () => {
  const defaultProps = {
    id: 'test-id',
    label: 'Test Label',
    handleDelete: jest.fn(),
  };

  const renderComponent = (props = {}) => {
    return render(<ComplexLookupSelectedItem {...defaultProps} {...props} />);
  };

  it('renders with basic props', () => {
    const { getByTestId } = renderComponent();

    expect(getByTestId('complex-lookup-selected')).toBeInTheDocument();
    expect(getByTestId('complex-lookup-selected-label')).toHaveTextContent('Test Label');
    expect(getByTestId('complex-lookup-selected-delete')).toBeInTheDocument();
  });

  it('calls handleDelete with id when delete button is clicked', () => {
    const handleDelete = jest.fn();
    const { getByTestId } = renderComponent({ handleDelete });

    fireEvent.click(getByTestId('complex-lookup-selected-delete'));

    expect(handleDelete).toHaveBeenCalledWith('test-id');
  });

  it('does not show warning icon by default', () => {
    const { container } = renderComponent();

    expect(container.querySelector('.complex-lookup-selected-icon-warning')).not.toBeInTheDocument();
  });

  it('shows warning icon when noWarningValue is false', () => {
    const { container } = renderComponent({
      noWarningValue: false,
    });

    expect(container.querySelector('.complex-lookup-selected-icon-warning')).toBeInTheDocument();
  });

  it('applies correct classes based on props', () => {
    const { getByTestId } = renderComponent({
      noWarningValue: false,
    });

    const container = getByTestId('complex-lookup-selected');

    expect(container).toHaveClass('complex-lookup-selected-withWarning');
    expect(container).not.toHaveClass('complex-lookup-selected-embedded');
  });
});
