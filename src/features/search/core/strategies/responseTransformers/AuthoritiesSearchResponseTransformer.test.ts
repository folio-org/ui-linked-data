import { AuthoritiesSearchResponseTransformer } from './AuthoritiesSearchResponseTransformer';

describe('AuthoritiesSearchResponseTransformer', () => {
  const transformer = new AuthoritiesSearchResponseTransformer();
  const mockLimit = 10;

  it('transforms authorities search response', () => {
    const response = {
      authorities: [{ id: '1', personalName: 'Shakespeare' }],
      totalRecords: 15,
    };

    const result = transformer.transform(response, mockLimit);

    expect(result.content).toEqual([{ id: '1', personalName: 'Shakespeare' }]);
    expect(result.totalRecords).toBe(15);
    expect(result.totalPages).toBe(2);
  });

  it('inherits from StandardResponseTransformer with authorities container', () => {
    expect(transformer.resultsContainer).toBe('authorities');
  });

  it('handles empty response', () => {
    const result = transformer.transform({}, mockLimit);

    expect(result.content).toEqual([]);
    expect(result.totalRecords).toBe(0);
  });
});
