import { defineMemoizedValue } from '@common/helpers/memoizedValue.helper';

describe('memoizedValue.helper', () => {
  const defaultValue = false;

  test('defineMemoizedValue - get default value', () => {
    const { getValue } = defineMemoizedValue(defaultValue);

    const result = getValue();

    expect(result).toBe(defaultValue);
  });

  test('defineMemoizedValue - update value', () => {
    const updatedValue = true;
    const { getValue, setValue } = defineMemoizedValue(defaultValue);

    const defaultResult = getValue();
    expect(defaultResult).toBe(defaultValue);

    setValue(updatedValue);
    const updatedResult = getValue();

    expect(updatedResult).toBe(updatedValue);
  });
});
