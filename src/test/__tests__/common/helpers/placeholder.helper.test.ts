import { getPlaceholderForProperty } from "@common/helpers/placeholder.helper";

describe('getPlaceholderForProperty', () => {
  const placeholder = 'ld.placeholder.processing';

  test('returns placeholder for ID property', () => {
    const property = 'http://bibfra.me/vocab/lite/createdDate';
    const result = getPlaceholderForProperty(property);
    expect(result).toEqual(placeholder);
  });

  test('returns placeholder for created date property', () => {
    const property = 'http://bibfra.me/vocab/marc/controlNumber';
    const result = getPlaceholderForProperty(property);
    expect(result).toEqual(placeholder);
  });

  test('returns undefined for other property', () => {
    const property = 'another-property';
    const result = getPlaceholderForProperty(property);
    expect(result).toBeUndefined();
  });

  test('returns undefined for empty property', () => {
    const property = '';
    const result = getPlaceholderForProperty(property);
    expect(result).toBeUndefined();
  });

  test('returns undefined for undefined property', () => {
    const property = undefined;
    const result = getPlaceholderForProperty(property);
    expect(result).toBeUndefined();
  });
});