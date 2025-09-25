import { buildHubSearchQuery } from '@common/helpers/search/queryBuilder/hubs';
import { SearchableIndex, SearchableIndexQuerySelector } from '@common/constants/complexLookup.constants';

describe('buildHubSearchQuery', () => {
  const mockMap = {
    [SearchableIndex.HubNameLeftAnchored]: {
      [SearchableIndexQuerySelector.Query]: ':value'
    },
    [SearchableIndex.HubNameKeyword]: {
      [SearchableIndexQuerySelector.Query]: ':value'
    }
  };

  test('should generate correct parameters for HubNameLeftAnchored', () => {
    const result = buildHubSearchQuery({
      map: mockMap,
      searchBy: SearchableIndex.HubNameLeftAnchored,
      value: 'test query'
    });
    
    expect(result).toEqual({
      queryType: 'parameters',
      query: 'test query',
      urlParams: { q: 'test query' }
    });
  });

  test('should generate correct parameters for HubNameKeyword', () => {
    const result = buildHubSearchQuery({
      map: mockMap,
      searchBy: SearchableIndex.HubNameKeyword,
      value: 'test query'
    });
    
    expect(result).toEqual({
      queryType: 'parameters',
      query: 'test query',
      urlParams: { 
        q: 'test query',
        searchtype: 'keyword'
      }
    });
  });

  test('should fallback to default parameters for unknown search type', () => {
    const result = buildHubSearchQuery({
      map: {},
      searchBy: SearchableIndex.HubNameLeftAnchored,
      value: 'test query'
    });
    
    expect(result).toEqual({
      queryType: 'parameters',
      query: 'test query',
      urlParams: { q: 'test query' }
    });
  });
});