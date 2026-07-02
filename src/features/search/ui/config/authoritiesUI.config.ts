import { SearchableIndex } from '@/common/constants/searchableIndex.constants';

import type { SearchTypeUIConfig } from '../types';

//Authorities Search UI Configuration
export const authoritiesUIConfig: SearchTypeUIConfig = {
  ui: {
    titleId: 'ld.authorities',
    subtitleId: 'ld.recordsFound',
    placeholderId: 'ld.enterSearchCriteria',
    emptyStateId: 'ld.chooseFilterOrEnterSearchQuery',
    noResultsId: 'ld.searchNoRdsMatch',
  },
  // Base-level features: used by the Search page (flat, source-toggled)
  features: {
    hasSegments: false,
    hasSourceToggle: true,
    hasSearchBy: true,
    hasQueryInput: true,
    hasMultilineInput: false,
    hasSubmitButton: true,
    hasAdvancedSearch: false,
    isVisiblePaginationCount: true,
    isLoopedPagination: false,
    isVisibleSubLabel: true,
    isVisibleEmptySearchPlaceholder: true,
  },
  // Base-level combined SearchBy list: all options across all sources
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
      labelId: 'ld.family',
      value: SearchableIndex.Family,
    },
    {
      labelId: 'ld.form',
      value: SearchableIndex.Form,
    },
    {
      labelId: 'ld.jurisdiction',
      value: SearchableIndex.Jurisdiction,
    },
    {
      labelId: 'ld.meeting',
      value: SearchableIndex.Meeting,
    },
    {
      labelId: 'ld.organization',
      value: SearchableIndex.Organization,
    },
    {
      labelId: 'ld.person',
      value: SearchableIndex.Person,
    },
    {
      labelId: 'ld.place',
      value: SearchableIndex.Place,
    },
    {
      labelId: 'ld.temporal',
      value: SearchableIndex.Temporal,
    },
    {
      labelId: 'ld.topic',
      value: SearchableIndex.Topic,
    },
    {
      labelId: 'ld.complexSubject',
      value: SearchableIndex.ComplexSubject,
    },
    {
      labelId: 'ld.uniformTitle',
      value: SearchableIndex.UniformTitle,
    },
    {
      labelId: 'ld.nameTitle',
      value: SearchableIndex.NameTitle,
    },
  ],

  // Segment-specific overrides for complex-lookup (Edit page modals).
  // These override the base config and are NOT used by the Search page.
  segments: {
    search: {
      limit: 100, // UI shows all 100 results per page
      features: {
        hasSegments: true,
        hasSourceToggle: false,
        hasSearchBy: true,
        hasQueryInput: true,
        hasMultilineInput: true,
        hasAdvancedSearch: false,
        isVisiblePaginationCount: true,
        isVisibleEmptySearchPlaceholder: true,
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
        hasSegments: true,
        // Disable source toggle in browse segment
        hasSourceToggle: false,
        hasAdvancedSearch: false,
        isLoopedPagination: true,
        isVisiblePaginationCount: false,
        isVisibleSubLabel: false,
        isVisibleEmptySearchPlaceholder: true,
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
