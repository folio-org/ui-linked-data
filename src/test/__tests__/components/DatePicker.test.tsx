import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';

import { DatePicker } from '@/components/DatePicker/DatePicker';

describe('DatePicker Component', () => {
  it('renders the input element with correct attributes', () => {
    render(<DatePicker id="test-date" value="2024-11-11" onChange={() => {}} />);

    const input = screen.getByTestId('date-picker-input-test-date');

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'date');
    expect(input).toHaveAttribute('id', 'test-date');
    expect(input).toHaveAttribute('value', '2024-11-11');
  });

  it('calls onChange handler when input value changes', () => {
    const handleChange = jest.fn();

    render(<DatePicker id="test-date" value="2024-11-11" onChange={handleChange} />);

    const input = screen.getByTestId('date-picker-input-test-date');
    fireEvent.change(input, { target: { value: '2024-12-25' } });

    expect(handleChange).toHaveBeenCalledWith('2024-12-25');
  });

  it('renders with optional placeholder and name props', () => {
    render(
      <DatePicker
        id="test-date"
        value="2024-11-11"
        onChange={() => {}}
        placeholder="Select a date"
        name="datePicker"
      />,
    );

    const input = screen.getByPlaceholderText('Select a date');

    expect(input).toHaveAttribute('name', 'datePicker');
  });

  describe('accessibility', () => {
    const baseProps = { id: 'test-date', value: '2024-11-11', onChange: () => {} };

    test.each([
      ['default', {}],
      ['with placeholder and name', { placeholder: 'Select a date', name: 'datePicker' }],
    ])('has no accessibility violations when %s', async (_description, overrides) => {
      const { container } = render(<DatePicker {...baseProps} {...overrides} />);

      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });
  });
});
