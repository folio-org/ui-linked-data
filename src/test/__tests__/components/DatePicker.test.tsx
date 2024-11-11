import { render, screen, fireEvent } from '@testing-library/react';
import { DatePicker } from '@components/DatePicker/DatePicker';

describe('DatePicker Component', () => {
  it('renders the input element with correct attributes', () => {
    render(<DatePicker id="test-date" value="2023-10-10" onChange={() => {}} />);

    const input = screen.getByTestId('date-picker-input-test-date');

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'date');
    expect(input).toHaveAttribute('id', 'test-date');
    expect(input).toHaveAttribute('value', '2023-10-10');
  });

  it('calls onChange handler when input value changes', () => {
    const handleChange = jest.fn();

    render(<DatePicker id="test-date" value="2023-10-10" onChange={handleChange} />);

    const input = screen.getByTestId('date-picker-input-test-date');
    fireEvent.change(input, { target: { value: '2023-12-25' } });

    expect(handleChange).toHaveBeenCalledWith('2023-12-25');
  });

  it('renders with optional placeholder and name props', () => {
    render(
      <DatePicker
        id="test-date"
        value="2023-10-10"
        onChange={() => {}}
        placeholder="Select a date"
        name="datePicker"
      />,
    );

    const input = screen.getByPlaceholderText('Select a date');

    expect(input).toHaveAttribute('name', 'datePicker');
  });
});
