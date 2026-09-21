import { setInitialGlobalState } from '@/test/__mocks__/store';

import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';

import { SearchTypeConfig } from '@/features/search/core/types';

import { useSearchStore } from '@/store';

import type { SearchProviderProps } from '../../types/provider.types';
import { Search } from './Search';

const mockConfig = {
  id: 'resources',
  defaults: {
    segment: 'search',
  },
  sources: {
    source1: {},
  },
} as unknown as SearchTypeConfig;

const mockUIConfig = {
  features: {
    hasSegments: false,
    hasSearchBy: true,
    hasQueryInput: true,
    hasSubmitButton: true,
  },
  ui: {
    emptyStateId: 'ld.enterSearchCriteria',
  },
};

jest.mock('../../providers/SearchProvider', () => ({
  SearchProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="search-provider">{children}</div>,
}));

// Mock the search registry for dynamic mode tests
jest.mock('../../../core', () => ({
  ...jest.requireActual('../../../core'),
  getSearchCoreConfig: (key: string) => {
    if (key === 'resources' || key === 'hubs') {
      return { id: key };
    }

    return undefined;
  },
}));

jest.mock('../../config', () => ({
  ...jest.requireActual('../../config'),
  resolveUIConfig: (key: string) => {
    if (key === 'resources' || key === 'hubs') {
      return { ui: {}, features: {} };
    }

    return undefined;
  },
}));

describe('Search', () => {
  beforeEach(() => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          navigationState: {},
        },
      },
    ]);
  });

  describe('Static mode (with config and uiConfig)', () => {
    test('renders with required props', () => {
      render(
        <Search coreConfig={mockConfig} uiConfig={mockUIConfig} flow="url">
          <div>Search Content</div>
        </Search>,
      );

      expect(screen.getByTestId('search-provider')).toBeInTheDocument();
      expect(screen.getByText('Search Content')).toBeInTheDocument();
    });

    test('renders with mode="custom"', () => {
      render(
        <Search coreConfig={mockConfig} uiConfig={mockUIConfig} flow="url" mode="custom">
          <div>Custom Mode Content</div>
        </Search>,
      );

      expect(screen.getByText('Custom Mode Content')).toBeInTheDocument();
    });

    test('renders with mode="auto"', () => {
      render(
        <Search coreConfig={mockConfig} uiConfig={mockUIConfig} flow="url" mode="auto">
          <div>Auto Mode Content</div>
        </Search>,
      );

      expect(screen.getByText('Auto Mode Content')).toBeInTheDocument();
    });

    test('renders with flow="value"', () => {
      render(
        <Search coreConfig={mockConfig} uiConfig={mockUIConfig} flow="value">
          <div>Value Flow Content</div>
        </Search>,
      );

      expect(screen.getByText('Value Flow Content')).toBeInTheDocument();
    });

    test('returns null when config is not provided', () => {
      const { container } = render(
        <Search coreConfig={undefined as unknown as SearchTypeConfig} uiConfig={mockUIConfig} flow="url">
          <div>Should Not Render</div>
        </Search>,
      );

      expect(container).toBeEmptyDOMElement();
    });

    test('returns null when uiConfig is not provided', () => {
      const { container } = render(
        <Search coreConfig={mockConfig} uiConfig={undefined as unknown as typeof mockUIConfig} flow="url">
          <div>Should Not Render</div>
        </Search>,
      );

      expect(container).toBeEmptyDOMElement();
    });

    test('applies correct container className', () => {
      const { container } = render(
        <Search coreConfig={mockConfig} uiConfig={mockUIConfig} flow="url">
          <div>Content</div>
        </Search>,
      );

      const searchContainer = container.querySelector('.item-search');
      expect(searchContainer).toBeInTheDocument();
    });

    test('has correct test id', () => {
      render(
        <Search coreConfig={mockConfig} uiConfig={mockUIConfig} flow="url">
          <div>Content</div>
        </Search>,
      );

      expect(screen.getByTestId('id-search')).toBeInTheDocument();
    });

    test('renders multiple children', () => {
      render(
        <Search coreConfig={mockConfig} uiConfig={mockUIConfig} flow="url">
          <div>Child 1</div>
          <div>Child 2</div>
          <div>Child 3</div>
        </Search>,
      );

      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
      expect(screen.getByText('Child 3')).toBeInTheDocument();
    });

    test('defaults to custom mode when mode is not specified', () => {
      render(
        <Search coreConfig={mockConfig} uiConfig={mockUIConfig} flow="url">
          <div>Default Mode</div>
        </Search>,
      );

      expect(screen.getByText('Default Mode')).toBeInTheDocument();
    });
  });

  describe('Dynamic mode (with segments)', () => {
    test('renders with segments prop', () => {
      render(
        <Search segments={['resources', 'hubs']} flow="url">
          <div>Dynamic Mode Content</div>
        </Search>,
      );

      expect(screen.getByTestId('search-provider')).toBeInTheDocument();
      expect(screen.getByText('Dynamic Mode Content')).toBeInTheDocument();
    });

    test('renders with defaultSegment prop', () => {
      render(
        <Search segments={['resources', 'hubs']} defaultSegment="hubs" flow="url">
          <div>Default Segment Content</div>
        </Search>,
      );

      expect(screen.getByText('Default Segment Content')).toBeInTheDocument();
    });

    test('renders with defaultSource prop', () => {
      render(
        <Search segments={['resources', 'hubs']} defaultSource="internal" flow="url">
          <div>Default Source Content</div>
        </Search>,
      );

      expect(screen.getByText('Default Source Content')).toBeInTheDocument();
    });

    test('renders with flow="value" in dynamic mode', () => {
      render(
        <Search segments={['resources', 'hubs']} flow="value">
          <div>Value Flow Dynamic</div>
        </Search>,
      );

      expect(screen.getByText('Value Flow Dynamic')).toBeInTheDocument();
    });

    test('returns null when segments array is empty', () => {
      const { container } = render(
        <Search segments={[]} flow="url">
          <div>Should Not Render</div>
        </Search>,
      );

      expect(container).toBeEmptyDOMElement();
    });
  });

  describe('accessibility', () => {
    test.each([
      [
        'static mode with required props',
        { coreConfig: mockConfig, uiConfig: mockUIConfig, flow: 'url' as const, children: <div>Search Content</div> },
      ],
      [
        'static mode="auto"',
        {
          coreConfig: mockConfig,
          uiConfig: mockUIConfig,
          flow: 'url' as const,
          mode: 'auto' as const,
          children: <div>Auto Mode Content</div>,
        },
      ],
      [
        'static flow="value"',
        {
          coreConfig: mockConfig,
          uiConfig: mockUIConfig,
          flow: 'value' as const,
          children: <div>Value Flow Content</div>,
        },
      ],
      [
        'config not provided',
        {
          coreConfig: undefined as unknown as SearchTypeConfig,
          uiConfig: mockUIConfig,
          flow: 'url' as const,
          children: <div>Should Not Render</div>,
        },
      ],
      [
        'dynamic mode with segments',
        { segments: ['resources', 'hubs'], flow: 'url' as const, children: <div>Dynamic Mode Content</div> },
      ],
      [
        'dynamic mode with empty segments',
        { segments: [] as string[], flow: 'url' as const, children: <div>Should Not Render</div> },
      ],
    ] as [string, SearchProviderProps][])('has no accessibility violations when %s', async (_description, props) => {
      const { container } = render(<Search {...props} />);

      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });
  });
});
