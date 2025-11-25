import { render, screen } from '@testing-library/react';
import { Search } from './Search';
import { setInitialGlobalState } from '@/test/__mocks__/store';
import { useSearchStore } from '@/store';
import { SearchTypeConfig } from '@/features/search/core/types';

const mockConfig = {
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

  test('renders with required props', () => {
    render(
      <Search config={mockConfig} uiConfig={mockUIConfig} flow="url">
        <div>Search Content</div>
      </Search>,
    );

    expect(screen.getByTestId('search-provider')).toBeInTheDocument();
    expect(screen.getByText('Search Content')).toBeInTheDocument();
  });

  test('renders with mode="custom"', () => {
    render(
      <Search config={mockConfig} uiConfig={mockUIConfig} flow="url" mode="custom">
        <div>Custom Mode Content</div>
      </Search>,
    );

    expect(screen.getByText('Custom Mode Content')).toBeInTheDocument();
  });

  test('renders with mode="auto"', () => {
    render(
      <Search config={mockConfig} uiConfig={mockUIConfig} flow="url" mode="auto">
        <div>Auto Mode Content</div>
      </Search>,
    );

    expect(screen.getByText('Auto Mode Content')).toBeInTheDocument();
  });

  test('renders with initialSegment prop', () => {
    render(
      <Search config={mockConfig} uiConfig={mockUIConfig} flow="url" initialSegment="browse">
        <div>Browse Content</div>
      </Search>,
    );

    expect(screen.getByText('Browse Content')).toBeInTheDocument();
  });

  test('renders with flow="value"', () => {
    render(
      <Search config={mockConfig} uiConfig={mockUIConfig} flow="value">
        <div>Value Flow Content</div>
      </Search>,
    );

    expect(screen.getByText('Value Flow Content')).toBeInTheDocument();
  });

  test('returns null when config is not provided', () => {
    const { container } = render(
      <Search config={undefined} uiConfig={mockUIConfig} flow="url">
        <div>Should Not Render</div>
      </Search>,
    );

    expect(container).toBeEmptyDOMElement();
  });

  test('returns null when uiConfig is not provided', () => {
    const { container } = render(
      <Search config={mockConfig} uiConfig={undefined} flow="url">
        <div>Should Not Render</div>
      </Search>,
    );

    expect(container).toBeEmptyDOMElement();
  });

  test('applies correct container className', () => {
    const { container } = render(
      <Search config={mockConfig} uiConfig={mockUIConfig} flow="url">
        <div>Content</div>
      </Search>,
    );

    const searchContainer = container.querySelector('.item-search');
    expect(searchContainer).toBeInTheDocument();
  });

  test('has correct test id', () => {
    render(
      <Search config={mockConfig} uiConfig={mockUIConfig} flow="url">
        <div>Content</div>
      </Search>,
    );

    expect(screen.getByTestId('id-search')).toBeInTheDocument();
  });

  test('renders multiple children', () => {
    render(
      <Search config={mockConfig} uiConfig={mockUIConfig} flow="url">
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
      <Search config={mockConfig} uiConfig={mockUIConfig} flow="url">
        <div>Default Mode</div>
      </Search>,
    );

    expect(screen.getByText('Default Mode')).toBeInTheDocument();
  });
});
