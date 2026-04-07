import { extractNestedData } from './dataExtraction';

describe('extractNestedData', () => {
  it('returns the entire response when no key is provided', () => {
    const data = [{ id: '1', name: 'Item 1' }];
    const result = extractNestedData(data);

    expect(result).toEqual(data);
  });

  it('extracts data from response using the provided key', () => {
    const expectedData = [{ id: '1', name: 'Item 1' }];
    const response = {
      authoritySourceFiles: expectedData,
      totalRecords: 1,
      metadata: { created: '2024-01-01' },
    };
    const result = extractNestedData(response, 'authoritySourceFiles');

    expect(result).toEqual(expectedData);
  });

  it('returns the entire response if key does not exist', () => {
    const response = {
      dataField: [{ id: '1' }],
      otherField: 'value',
    };
    const result = extractNestedData(response, 'nonExistentKey');

    expect(result).toEqual(response);
  });

  it('returns the response when key is provided but response is not an object', () => {
    const data = 'string response';
    const result = extractNestedData(data, 'someKey');

    expect(result).toEqual(data);
  });

  it('returns the response when key is provided and response is null', () => {
    const result = extractNestedData(null, 'someKey');

    expect(result).toEqual(null);
  });

  it('handles undefined key gracefully', () => {
    const data = { field: 'value' };
    const result = extractNestedData(data);

    expect(result).toEqual(data);
  });

  it('extracts deeply nested data structure', () => {
    const expectedData = [{ id: 'auth-1', source: 'loc' }];
    const response = {
      response: {
        authoritySourceFiles: expectedData,
      },
    };
    const result = extractNestedData(response, 'response');

    expect(result).toEqual({ authoritySourceFiles: expectedData });
  });
});
