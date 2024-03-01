import { render, screen, fireEvent } from '@testing-library/react';
import { ComplexLookupField } from '@components/ComplexLookupField';

describe('Complex Lookup Field', () => {
  const onChange = jest.fn();
  const uuid = 'test-uuid';

  const { getByTestId, queryByTestId } = screen;

  function renderComponent() {
    render(<ComplexLookupField uuid={uuid} onChange={onChange} />);
  }

  test('renders Complex Lookup Field component with label', () => {
    renderComponent();

    expect(getByTestId('complex-lookup')).toBeInTheDocument();
    expect(getByTestId('complex-lookup-label')).toBeInTheDocument();
  });

  test('renders Complex Lookup Field component without label', () => {
    renderComponent();

    expect(getByTestId('complex-lookup')).toBeInTheDocument();
    expect(queryByTestId('complex-lookup-label')).not.toBeInTheDocument();
  });

  test('triggers onChange', () => {
    const event = {
      target: {
        value: 'testValue',
      },
    };

    renderComponent();
    fireEvent.change(getByTestId('complex-lookup-input'), event);

    expect(onChange).toHaveBeenCalledWith(uuid, [
      { label: event.target.value, meta: { uri: '__MOCK_URI_CHANGE_WHEN_IMPLEMENTING' } },
    ]);
  });
});
