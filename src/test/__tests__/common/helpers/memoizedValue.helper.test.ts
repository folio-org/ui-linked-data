import { useMemoizedValue } from '@common/helpers/memoizedValue.helper';

describe('memoizedValue.helper', () => {
  const defaultValue = false;

  test('useMemoizedValue - get default value', () => {
    const { getValue } = useMemoizedValue(defaultValue);

    const result = getValue();

    expect(result).toBe(defaultValue);
  });

  test('useMemoizedValue - update value', () => {
    const updatedValue = true;
    const { getValue, setValue } = useMemoizedValue(defaultValue);

    const defaultResult = getValue();
    expect(defaultResult).toBe(defaultValue);

    setValue(updatedValue);
    const updatedResult = getValue();

    expect(updatedResult).toBe(updatedValue);
  });
});
