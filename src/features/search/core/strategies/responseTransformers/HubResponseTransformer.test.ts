import { HubResponseTransformer } from './HubResponseTransformer';

describe('HubResponseTransformer', () => {
  const transformer = new HubResponseTransformer();
  const mockLimit = 10;

  it('transforms hub response with hits and count', () => {
    const response = {
      hits: [
        { id: '1', label: 'Hub 1' },
        { id: '2', label: 'Hub 2' },
      ],
      count: 25,
    };

    const result = transformer.transform(response, mockLimit);

    expect(result.content).toEqual([
      { id: '1', label: 'Hub 1' },
      { id: '2', label: 'Hub 2' },
    ]);
    expect(result.totalRecords).toBe(25);
    expect(result.totalPages).toBe(3);
    expect(result.prev).toBeUndefined();
    expect(result.next).toBeUndefined();
  });

  it('handles empty hub response', () => {
    const result = transformer.transform({}, mockLimit);

    expect(result.content).toEqual([]);
    expect(result.totalRecords).toBe(0);
    expect(result.totalPages).toBe(0);
  });

  it('handles response with hits but no count', () => {
    const response = {
      hits: [{ id: '1' }],
    };

    const result = transformer.transform(response, mockLimit);

    expect(result.content).toEqual([{ id: '1' }]);
    expect(result.totalRecords).toBe(0);
  });

  it('handles response with count but no hits', () => {
    const response = {
      count: 10,
    };

    const result = transformer.transform(response, mockLimit);

    expect(result.content).toEqual([]);
    expect(result.totalRecords).toBe(10);
  });

  it('calculates totalPages correctly', () => {
    const response = {
      hits: [],
      count: 55,
    };

    const result = transformer.transform(response, mockLimit);

    expect(result.totalPages).toBe(6);
  });
});
