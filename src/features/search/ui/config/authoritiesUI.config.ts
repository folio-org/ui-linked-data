import { SearchableIndex } from '@/common/constants/searchableIndex.constants';
import type { SearchTypeUIConfig } from '../types';

//Authorities Search UI Configuration
export const authoritiesUIConfig: SearchTypeUIConfig = {
  ui: {
    titleId: 'ld.marcAuthority',
    subtitleId: '',
    placeholderId: 'ld.enterSearchCriteria',
    emptyStateId: 'ld.noResultsFound',
  },
  features: {
    // Navigation
    hasSegments: true, // Authorities has segments (search/browse)
    hasSourceToggle: false, // Will be enabled per-segment

    // Input controls (shared)
    hasSearchBy: true,
    hasQueryInput: true,
    hasMultilineInput: true,
    hasSubmitButton: true,

    // Additional features
    hasAdvancedSearch: false,
    isVisiblePaginationCount: true,
    isLoopedPagination: false,
    isVisibleSubLabel: false,
  },

  // Segment-specific overrides
  segments: {
    search: {
      limit: 100, // UI shows all 100 results per page
      features: {
        hasSourceToggle: false,
        hasAdvancedSearch: false,
      },
      searchableIndices: [
        {
          labelId: 'ld.keyword',
          value: SearchableIndex.Keyword,
        },
        {
          labelId: 'ld.identifierAll',
          value: SearchableIndex.Identifier,
        },
        {
          labelId: 'ld.lccn',
          value: SearchableIndex.LCCN,
        },
        {
          labelId: 'ld.personalName',
          value: SearchableIndex.PersonalName,
        },
        {
          labelId: 'ld.corporateName',
          value: SearchableIndex.CorporateConferenceName,
        },
        {
          labelId: 'ld.geographicName',
          value: SearchableIndex.GeographicName,
        },
        {
          labelId: 'ld.nameTitle',
          value: SearchableIndex.NameTitle,
        },
        {
          labelId: 'ld.uniformTitle',
          value: SearchableIndex.UniformTitle,
        },
        {
          labelId: 'ld.subject',
          value: SearchableIndex.Subject,
        },
        {
          labelId: 'ld.childrensSubjectHeading',
          value: SearchableIndex.ChildrenSubjectHeading,
        },
        {
          labelId: 'ld.genre',
          value: SearchableIndex.Genre,
        },
      ],
    },

    browse: {
      limit: 100, // UI shows all 100 results per page
      features: {
        // Disable source toggle in browse segment
        hasSourceToggle: false,
        hasAdvancedSearch: false,
        isLoopedPagination: true,
      },
      searchableIndices: [
        {
          labelId: 'ld.personalName',
          value: SearchableIndex.PersonalName,
        },
        {
          labelId: 'ld.corporateName',
          value: SearchableIndex.CorporateConferenceName,
        },
        {
          labelId: 'ld.geographicName',
          value: SearchableIndex.GeographicName,
        },
        {
          labelId: 'ld.nameTitle',
          value: SearchableIndex.NameTitle,
        },
        {
          labelId: 'ld.uniformTitle',
          value: SearchableIndex.UniformTitle,
        },
        {
          labelId: 'ld.subject',
          value: SearchableIndex.Subject,
        },
        {
          labelId: 'ld.genre',
          value: SearchableIndex.Genre,
        },
      ],
    },
  },
};
