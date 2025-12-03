import { AuthoritiesBrowseResponseTransformer } from './AuthoritiesBrowseResponseTransformer';

describe('AuthoritiesBrowseResponseTransformer', () => {
  const transformer = new AuthoritiesBrowseResponseTransformer();
  const mockLimit = 10;

  it('transforms authorities browse response', () => {
    const response = {
      items: [{ id: '1', headingRef: 'Shakespeare' }],
      totalRecords: 30,
    };

    const result = transformer.transform(response, mockLimit);

    expect(result.content).toEqual([{ id: '1', headingRef: 'Shakespeare' }]);
    expect(result.totalRecords).toBe(30);
    expect(result.totalPages).toBe(3);
  });

  it('inherits from StandardResponseTransformer with items container', () => {
    expect(transformer.resultsContainer).toBe('items');
  });

  it('handles empty response', () => {
    const result = transformer.transform({}, mockLimit);

    expect(result.content).toEqual([]);
    expect(result.totalRecords).toBe(0);
  });
});
