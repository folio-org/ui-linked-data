import { HubLocalResponseTransformer } from './HubLocalResponseTransformer';

describe('HubLocalResponseTransformer', () => {
  const transformer = new HubLocalResponseTransformer();
  const mockLimit = 10;

  it('Transforms hub local response', () => {
    const response = {
      content: [
        { id: 'hub_1', label: 'Test Hub 1' },
        { id: 'hub_2', label: 'Test Hub 2' },
      ],
      totalRecords: 25,
    };

    const result = transformer.transform(response, mockLimit);

    expect(result.content).toEqual([
      { id: 'hub_1', label: 'Test Hub 1' },
      { id: 'hub_2', label: 'Test Hub 2' },
    ]);
    expect(result.totalRecords).toBe(25);
    expect(result.totalPages).toBe(3);
  });

  it('Inherits from StandardResponseTransformer with content container', () => {
    expect(transformer.resultsContainer).toBe('content');
  });

  it('Handles empty response', () => {
    const result = transformer.transform({}, mockLimit);

    expect(result.content).toEqual([]);
    expect(result.totalRecords).toBe(0);
  });

  it('Calculates totalPages when not provided in response', () => {
    const response = {
      content: [{ id: 'hub_1', label: 'Hub' }],
      totalRecords: 42,
    };

    const result = transformer.transform(response, 10);

    expect(result.totalPages).toBe(5);
  });

  it('Uses totalPages from response when provided', () => {
    const response = {
      content: [{ id: 'hub_1', label: 'Hub' }],
      totalRecords: 42,
      totalPages: 10,
    };

    const result = transformer.transform(response, 10);

    expect(result.totalPages).toBe(10);
  });

  it('Handles response with prev and next links', () => {
    const response = {
      content: [{ id: 'hub_1', label: 'Hub' }],
      totalRecords: 30,
      prev: '/hubs?offset=0',
      next: '/hubs?offset=20',
    };

    const result = transformer.transform(response, mockLimit);

    expect(result.prev).toBe('/hubs?offset=0');
    expect(result.next).toBe('/hubs?offset=20');
  });
});
