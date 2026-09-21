import { SearchableIndex, SearchableIndexQuerySelector } from '@/common/constants/searchableIndex.constants';

export const HUB_SEARCHABLE_INDICES_MAP: HubSearchableIndicesMap = {
  [SearchableIndex.HubNameLeftAnchored]: {
    [SearchableIndexQuerySelector.Query]: {
      paramName: 'q',
      format: 'parameters',
    } as QueryParameterConfig,
  },
  [SearchableIndex.HubNameKeyword]: {
    [SearchableIndexQuerySelector.Query]: {
      paramName: 'q',
      additionalParams: {
        searchtype: 'keyword',
      },
      format: 'parameters',
    } as QueryParameterConfig,
  },
};

export const HUB_LOCAL_SEARCHABLE_INDICES_MAP: HubSearchableIndicesMap = {
  [SearchableIndex.HubNameLeftAnchored]: {
    [SearchableIndexQuerySelector.Query]: {
      paramName: 'label',
    } as QueryParameterConfig,
  },
  [SearchableIndex.HubNameKeyword]: {
    [SearchableIndexQuerySelector.Query]: {
      paramName: 'label',
    } as QueryParameterConfig,
  },
};
