import { ResourcesResponseTransformer } from './ResourcesResponseTransformer';

describe('ResourcesResponseTransformer', () => {
  const transformer = new ResourcesResponseTransformer();
  const mockLimit = 10;

  it('transforms resources response with content', () => {
    const response = {
      content: [
        { id: '1', title: 'Work 1' },
        { id: '2', title: 'Work 2' },
      ],
      totalRecords: 20,
      totalPages: 2,
    };

    const result = transformer.transform(response, mockLimit);

    expect(result.content).toEqual([
      { id: '1', title: 'Work 1' },
      { id: '2', title: 'Work 2' },
    ]);
    expect(result.totalRecords).toBe(20);
    expect(result.totalPages).toBe(2);
  });

  it('inherits from StandardResponseTransformer with content container', () => {
    expect(transformer.resultsContainer).toBe('content');
  });

  it('handles empty response', () => {
    const result = transformer.transform({}, mockLimit);

    expect(result.content).toEqual([]);
    expect(result.totalRecords).toBe(0);
  });
});
