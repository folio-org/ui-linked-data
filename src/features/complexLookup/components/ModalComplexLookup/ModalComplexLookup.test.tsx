import { IntlProvider } from 'react-intl';

import { render, screen } from '@testing-library/react';

import { setInitialGlobalState } from '@/test/__mocks__/store';

import { ComplexLookupType } from '@/features/complexLookup/constants/complexLookup.constants';

import { useMarcPreviewStore, useSearchStore, useUIStore } from '@/store';

import { COMPLEX_LOOKUPS_CONFIG } from '../../configs';
import { ModalComplexLookup } from './ModalComplexLookup';

const mockGetFacetsData = jest.fn();
const mockGetSourceData = jest.fn();
jest.mock('@/features/complexLookup/hooks/useComplexLookupApi', () => ({
  useComplexLookupApi: () => ({
    getFacetsData: mockGetFacetsData,
    getSourceData: mockGetSourceData,
  }),
}));

const mockFetchMarcData = jest.fn();
jest.mock('@/common/hooks/useMarcData', () => ({
  useMarcData: () => ({
    fetchMarcData: mockFetchMarcData,
  }),
}));

jest.mock('@/components/Modal', () => ({
  Modal: ({ children, isOpen }: { children: React.ReactNode; isOpen: boolean }) =>
    isOpen ? <div data-testid="modal">{children}</div> : null,
}));

const mockSearchProps = jest.fn();
jest.mock('@/features/search/ui', () => ({
  LegacySearch: (props: Record<string, unknown>) => {
    mockSearchProps(props);
    return <div data-testid="search-component">Search Component</div>;
  },
  LegacySearchControlPane: () => <div>SearchControlPane</div>,
}));

describe('ModalComplexLookup', () => {
  const mockOnAssign = jest.fn();
  const mockOnClose = jest.fn();

  const defaultProps = {
    isOpen: true,
    onAssign: mockOnAssign,
    onClose: mockOnClose,
  };

  beforeEach(() => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          query: '',
          searchBy: 'keyword',
        },
      },
      {
        store: useUIStore,
        state: {
          isMarcPreviewOpen: false,
        },
      },
      {
        store: useMarcPreviewStore,
        state: {
          complexValue: null,
          metadata: null,
        },
      },
    ]);
  });

  const renderComponent = (props = {}) => {
    const mergedProps = { ...defaultProps, ...props };

    return render(
      <IntlProvider locale="en">
        <ModalComplexLookup {...mergedProps} />
      </IntlProvider>,
    );
  };

  const getSearchProps = () => mockSearchProps.mock.calls.at(-1)?.[0] as Record<string, unknown>;

  describe('rendering', () => {
    test('renders modal when isOpen is true', () => {
      renderComponent();

      expect(screen.getByTestId('modal')).toBeInTheDocument();
      expect(screen.getByTestId('search-component')).toBeInTheDocument();
    });

    test('does not render when isOpen is false', () => {
      renderComponent({ isOpen: false });

      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });
  });

  describe('defaultSearchBy prop for Authorities', () => {
    test('passes correct defaultSearchBy from segments config', () => {
      renderComponent({ assignEntityName: ComplexLookupType.Authorities });

      const searchProps = getSearchProps();
      const authoritiesConfig = COMPLEX_LOOKUPS_CONFIG[ComplexLookupType.Authorities];

      expect(searchProps.defaultSearchBy).toBe(authoritiesConfig.segments?.defaultValues?.searchBy);
    });
  });

  describe('defaultSearchBy prop for Hub', () => {
    test('passes correct defaultSearchBy from searchBy.defaultValue', () => {
      renderComponent({ assignEntityName: ComplexLookupType.Hub });

      const searchProps = getSearchProps();
      const hubConfig = COMPLEX_LOOKUPS_CONFIG[ComplexLookupType.Hub];

      expect(searchProps.defaultSearchBy).toBe(hubConfig.searchBy?.defaultValue);
    });
  });

  describe('searchByControlOptions prop', () => {
    test('passes correct searchByControlOptions for Authorities', () => {
      renderComponent({ assignEntityName: ComplexLookupType.Authorities });

      const searchProps = getSearchProps();
      const authoritiesConfig = COMPLEX_LOOKUPS_CONFIG[ComplexLookupType.Authorities];

      expect(searchProps.searchByControlOptions).toBe(authoritiesConfig.searchBy.config);
    });

    test('passes correct searchByControlOptions for Hub', () => {
      renderComponent({ assignEntityName: ComplexLookupType.Hub });

      const searchProps = getSearchProps();
      const hubConfig = COMPLEX_LOOKUPS_CONFIG[ComplexLookupType.Hub];

      expect(searchProps.searchByControlOptions).toBe(hubConfig.searchBy.config);
    });

    test('passes correct searchByControlOptions for AuthoritiesSubject', () => {
      renderComponent({ assignEntityName: ComplexLookupType.AuthoritiesSubject });

      const searchProps = getSearchProps();
      const config = COMPLEX_LOOKUPS_CONFIG[ComplexLookupType.AuthoritiesSubject];

      expect(searchProps.searchByControlOptions).toBe(config.searchBy.config);
    });
  });

  describe('searchableIndicesMap prop', () => {
    test('passes correct searchableIndicesMap for Authorities', () => {
      renderComponent({ assignEntityName: ComplexLookupType.Authorities });

      const searchProps = getSearchProps();
      const authoritiesConfig = COMPLEX_LOOKUPS_CONFIG[ComplexLookupType.Authorities];

      expect(searchProps.searchableIndicesMap).toBe(authoritiesConfig.searchableIndicesMap);
    });

    test('passes correct searchableIndicesMap for Hub', () => {
      renderComponent({ assignEntityName: ComplexLookupType.Hub });

      const searchProps = getSearchProps();
      const hubConfig = COMPLEX_LOOKUPS_CONFIG[ComplexLookupType.Hub];

      expect(searchProps.searchableIndicesMap).toBe(hubConfig.searchableIndicesMap);
    });
  });

  describe('endpoint configuration', () => {
    test('passes correct endpoint config for Authorities', () => {
      renderComponent({ assignEntityName: ComplexLookupType.Authorities });

      const searchProps = getSearchProps();
      const authoritiesConfig = COMPLEX_LOOKUPS_CONFIG[ComplexLookupType.Authorities];

      expect(searchProps.endpointUrl).toBe(authoritiesConfig.api.endpoints.base);
      expect(searchProps.sameOrigin).toBe(authoritiesConfig.api.endpoints.sameOrigin);
      expect(searchProps.endpointUrlsBySegments).toBe(authoritiesConfig.api.endpoints.bySearchSegment);
    });

    test('passes correct endpoint config for Hub', () => {
      renderComponent({ assignEntityName: ComplexLookupType.Hub });

      const searchProps = getSearchProps();
      const hubConfig = COMPLEX_LOOKUPS_CONFIG[ComplexLookupType.Hub];

      expect(searchProps.endpointUrl).toBe(hubConfig.api.endpoints.base);
      expect(searchProps.sameOrigin).toBe(hubConfig.api.endpoints.sameOrigin);
    });
  });

  describe('segments configuration', () => {
    test('passes segments for Authorities', () => {
      renderComponent({ assignEntityName: ComplexLookupType.Authorities });

      const searchProps = getSearchProps();
      const authoritiesConfig = COMPLEX_LOOKUPS_CONFIG[ComplexLookupType.Authorities];

      expect(searchProps.primarySegments).toBe(authoritiesConfig.segments?.primary);
      expect(searchProps.isVisibleSegments).toBe(true);
    });

    test('does not pass segments for Hub', () => {
      renderComponent({ assignEntityName: ComplexLookupType.Hub });

      const searchProps = getSearchProps();

      expect(searchProps.isVisibleSegments).toBe(false);
    });
  });

  describe('common configuration', () => {
    test('passes multiline input config for Authorities', () => {
      renderComponent({ assignEntityName: ComplexLookupType.Authorities });

      const searchProps = getSearchProps();
      const authoritiesConfig = COMPLEX_LOOKUPS_CONFIG[ComplexLookupType.Authorities];

      expect(searchProps.common).toBe(authoritiesConfig.common);
    });

    test('passes non-multiline config for Hub', () => {
      renderComponent({ assignEntityName: ComplexLookupType.Hub });

      const searchProps = getSearchProps();
      const hubConfig = COMPLEX_LOOKUPS_CONFIG[ComplexLookupType.Hub];

      expect(searchProps.common).toBe(hubConfig.common);
    });
  });

  describe('visibility flags', () => {
    test('passes correct visibility flags', () => {
      renderComponent();

      const searchProps = getSearchProps();

      expect(searchProps.isVisibleFilters).toBe(false);
      expect(searchProps.isVisibleFullDisplay).toBe(false);
      expect(searchProps.isVisibleAdvancedSearch).toBe(false);
      expect(searchProps.isVisibleSearchByControl).toBe(true);
    });
  });

  describe('feature flags', () => {
    test('passes correct feature flags', () => {
      renderComponent();

      const searchProps = getSearchProps();

      expect(searchProps.hasMarcPreview).toBe(true);
      expect(searchProps.hasCustomPagination).toBe(true);
      expect(searchProps.hasSearchParams).toBe(false);
      expect(searchProps.isSortedResults).toBe(false);
    });
  });

  describe('defaultQuery handling', () => {
    test('passes value as defaultQuery when provided', () => {
      const testValue = 'test search query';
      renderComponent({ value: testValue });

      const searchProps = getSearchProps();

      expect(searchProps.defaultQuery).toBe(testValue);
    });

    test('passes undefined as defaultQuery when value is not provided', () => {
      renderComponent({ value: undefined });

      const searchProps = getSearchProps();

      expect(searchProps.defaultQuery).toBeUndefined();
    });
  });

  describe('callback props', () => {
    test('passes onAssignRecord callback', () => {
      renderComponent();

      const searchProps = getSearchProps();

      expect(searchProps.onAssignRecord).toBe(mockOnAssign);
    });

    test('passes function callbacks', () => {
      renderComponent();

      const searchProps = getSearchProps();

      expect(typeof searchProps.renderSearchControlPane).toBe('function');
      expect(typeof searchProps.renderResultsList).toBe('function');
      expect(typeof searchProps.renderMarcPreview).toBe('function');
      expect(typeof searchProps.getSearchSourceData).toBe('function');
      expect(typeof searchProps.getSearchFacetsData).toBe('function');
      expect(typeof searchProps.fetchSearchResults).toBe('function');
      expect(typeof searchProps.buildSearchQuery).toBe('function');
    });
  });
});
