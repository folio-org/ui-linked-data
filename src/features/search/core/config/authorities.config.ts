import { COMPLEX_LOOKUP_SEARCHABLE_INDICES_MAP } from '@/features/complexLookup/configs';
import { SearchableIndex as SearchableIndexEnum } from '@/common/constants/searchableIndex.constants';
import type { DataCapabilities, SearchableIndex, SearchTypeConfig } from '../types';
import { AuthoritiesSearchRequestBuilder, AuthoritiesBrowseRequestBuilder } from '../strategies/requestBuilders';
import {
  AuthoritiesSearchResponseTransformer,
  AuthoritiesBrowseResponseTransformer,
} from '../strategies/responseTransformers';

/**
 * Authorities Search Type Configuration
 *
 * Supports two segments:
 * - search: Standard keyword-based search
 * - browse: Alphabetical browsing by name/title
 */
export const authoritiesConfig: SearchTypeConfig = {
  id: 'authorities',

  // Base strategies for all authorities searches (defaults to search mode)
  strategies: {
    requestBuilder: new AuthoritiesSearchRequestBuilder(COMPLEX_LOOKUP_SEARCHABLE_INDICES_MAP),
    responseTransformer: new AuthoritiesSearchResponseTransformer(),
    resultFormatter: undefined,
  },

  // SearchBy configuration
  searchBy: {
    searchableIndices: [] as SearchableIndex[],
  },

  // Data capabilities
  capabilities: {} as DataCapabilities,

  // Segments with strategy overrides
  segments: {
    search: {
      id: 'search',
      // Inherits strategies from parent (AuthoritiesSearch*)
      searchBy: {
        searchableIndices: [
          { value: SearchableIndexEnum.Keyword },
          { value: SearchableIndexEnum.Identifier },
          { value: SearchableIndexEnum.LCCN },
          { value: SearchableIndexEnum.PersonalName },
          { value: SearchableIndexEnum.CorporateConferenceName },
          { value: SearchableIndexEnum.GeographicName },
          { value: SearchableIndexEnum.NameTitle },
          { value: SearchableIndexEnum.UniformTitle },
          { value: SearchableIndexEnum.Subject },
          { value: SearchableIndexEnum.ChildrenSubjectHeading },
          { value: SearchableIndexEnum.Genre },
        ] as SearchableIndex[],
      },
      capabilities: {} as DataCapabilities,
    },
    browse: {
      id: 'browse',
      // Override strategies for browse mode
      strategies: {
        requestBuilder: new AuthoritiesBrowseRequestBuilder(COMPLEX_LOOKUP_SEARCHABLE_INDICES_MAP),
        responseTransformer: new AuthoritiesBrowseResponseTransformer(),
      },
      searchBy: {
        searchableIndices: [
          { value: SearchableIndexEnum.PersonalName },
          { value: SearchableIndexEnum.CorporateConferenceName },
          { value: SearchableIndexEnum.GeographicName },
          { value: SearchableIndexEnum.NameTitle },
          { value: SearchableIndexEnum.UniformTitle },
          { value: SearchableIndexEnum.Subject },
          { value: SearchableIndexEnum.Genre },
        ] as SearchableIndex[],
      },
      capabilities: {} as DataCapabilities,
    },
  },

  // Default values
  defaults: {},
};
