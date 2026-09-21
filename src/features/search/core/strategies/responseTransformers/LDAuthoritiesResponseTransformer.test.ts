import { LDAuthoritiesResponseTransformer } from './LDAuthoritiesResponseTransformer';

describe('LDAuthoritiesResponseTransformer', () => {
  const transformer = new LDAuthoritiesResponseTransformer();
  const mockLimit = 10;

  it('transforms LD authorities response', () => {
    const response = {
      authorities: [{ id: 'ld-1', label: 'Shakespeare, William' }],
      totalRecords: 25,
    };

    const result = transformer.transform(response, mockLimit);

    expect(result.content).toEqual([{ id: 'ld-1', label: 'Shakespeare, William' }]);
    expect(result.totalRecords).toBe(25);
    expect(result.totalPages).toBe(3);
  });

  it('inherits from StandardResponseTransformer with authorities container', () => {
    expect(transformer.resultsContainer).toBe('authorities');
  });

  it('handles empty response', () => {
    const result = transformer.transform({}, mockLimit);

    expect(result.content).toEqual([]);
    expect(result.totalRecords).toBe(0);
  });

  it('handles zero totalRecords', () => {
    const response = { authorities: [], totalRecords: 0 };

    const result = transformer.transform(response, mockLimit);

    expect(result.content).toEqual([]);
    expect(result.totalPages).toBe(0);
  });
});
