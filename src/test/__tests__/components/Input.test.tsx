import { Input } from '@components/Input';
import { fireEvent, render, screen } from '@testing-library/react';

describe('Input', () => {
  const placeholder = 'test placeholder';
  const value = 'test value';
  const testId = 'test-id';
  const onChange = jest.fn();
  const onPressEnter = jest.fn();
  let inputElement: HTMLElement;

  beforeEach(() => {
    render(
      <Input placeholder={placeholder} value={value} testid={testId} onChange={onChange} onPressEnter={onPressEnter} />,
    );

    inputElement = screen.getByTestId(testId);
  });

  test('renders Input component with proper attributes', () => {
    expect(inputElement).toBeInTheDocument();
    expect(inputElement.getAttribute('placeholder')).toBe(placeholder);
    expect(inputElement.getAttribute('value')).toBe(value);
  });

  test('triggers passed "onChange" function', () => {
    fireEvent.change(inputElement, { target: { value: 'updated value' } });

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  test('triggers passed "onPressEnter" function', () => {
    fireEvent.change(inputElement, { target: { value: 'updated value' } });
    fireEvent.keyDown(inputElement, { key: 'Enter' });
    fireEvent.keyDown(inputElement, { key: 'NumpadEnter' });

    expect(onPressEnter).toHaveBeenCalledTimes(2);
  });
});
