import { render, screen, fireEvent } from '@testing-library/react';
import { ComplexLookupField } from '@components/ComplexLookupField';

describe('Complex Lookup Field', () => {
  const onChange = jest.fn();
  const label = 'test-label';
  const uuid = 'test-uuid';

  const { getByTestId } = screen;

  beforeEach(() => {
    render(<ComplexLookupField label={label} uuid={uuid} onChange={onChange} />);
  });

  test('renders Complex Lookup Field component', () => {
    expect(getByTestId('complex-lookup')).toBeInTheDocument();
  });

  test('triggers onChange', () => {
    const event = {
      target: {
        value: 'testValue',
      },
    };

    fireEvent.change(getByTestId('complex-lookup-input'), event);

    expect(onChange).toHaveBeenCalledWith(uuid, [
      { label: event.target.value, meta: { uri: '__MOCK_URI_CHANGE_WHEN_IMPLEMENTING' } },
    ]);
  });
});
