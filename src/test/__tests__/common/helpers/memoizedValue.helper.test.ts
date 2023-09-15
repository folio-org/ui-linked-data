import { useMemoizedValue } from '@common/helpers/memoizedValue.helper';

describe('memoizedValue.helper', () => {
  let defaultValue = false;

  test('useMemoizedValue - get default value', () => {
    const { getValue } = useMemoizedValue(defaultValue);

    expect(getValue()).toBe(defaultValue);
  });

  test('useMemoizedValue - update value', () => {
    const updatedValue = true;
    const { getValue, setValue } = useMemoizedValue(defaultValue);

    expect(getValue()).toBe(defaultValue);

    setValue(updatedValue);
    expect(getValue()).toBe(updatedValue);
  });
});
