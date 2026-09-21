import { setInitialGlobalState } from '@/test/__mocks__/store';

import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';

import { SearchParam } from '@/features/search/core';

import { useSearchStore } from '@/store';

import { SegmentGroup } from './SegmentGroup';

let mockCurrentSegment = '';

jest.mock('../../providers/SearchProvider', () => ({
  useSearchContext: () => ({
    currentSegment: mockCurrentSegment,
  }),
}));

describe('SegmentGroup', () => {
  const setNavigationState = jest.fn();

  beforeEach(() => {
    mockCurrentSegment = '';
  });

  it('renders children when no parentPath specified', () => {
    mockCurrentSegment = '';
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: { navigationState: {}, setNavigationState },
      },
    ]);

    render(
      <SegmentGroup>
        <button>Segment 1</button>
        <button>Segment 2</button>
      </SegmentGroup>,
    );

    expect(screen.getByText('Segment 1')).toBeInTheDocument();
    expect(screen.getByText('Segment 2')).toBeInTheDocument();
  });

  it('renders children when current segment matches parent path', () => {
    mockCurrentSegment = 'authorities';
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          navigationState: { [SearchParam.SEGMENT]: 'authorities' },
          setNavigationState,
        },
      },
    ]);

    render(
      <SegmentGroup parentPath="authorities">
        <button>Search</button>
        <button>Browse</button>
      </SegmentGroup>,
    );

    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Browse')).toBeInTheDocument();
  });

  it('renders children when current segment is a child of parent path', () => {
    mockCurrentSegment = 'authorities:search';
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          navigationState: { [SearchParam.SEGMENT]: 'authorities:search' },
          setNavigationState,
        },
      },
    ]);

    render(
      <SegmentGroup parentPath="authorities">
        <button>Search</button>
        <button>Browse</button>
      </SegmentGroup>,
    );

    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Browse')).toBeInTheDocument();
  });

  it('does not render when current segment does not match parent path', () => {
    mockCurrentSegment = 'resources';
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          navigationState: { [SearchParam.SEGMENT]: 'resources' },
          setNavigationState,
        },
      },
    ]);

    const { container } = render(
      <SegmentGroup parentPath="authorities">
        <button>Search</button>
        <button>Browse</button>
      </SegmentGroup>,
    );

    expect(container.firstChild).toBeNull();
  });

  it('applies custom className when provided', () => {
    mockCurrentSegment = '';
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: { navigationState: {}, setNavigationState },
      },
    ]);

    const { container } = render(
      <SegmentGroup className="custom-class">
        <button>Segment</button>
      </SegmentGroup>,
    );

    const group = container.querySelector('.search-segments.custom-class');
    expect(group).toBeInTheDocument();
  });

  it('applies default className when no custom className provided', () => {
    mockCurrentSegment = '';
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: { navigationState: {}, setNavigationState },
      },
    ]);

    const { container } = render(
      <SegmentGroup>
        <button>Segment</button>
      </SegmentGroup>,
    );

    const group = container.querySelector('.search-segments');
    expect(group).toBeInTheDocument();
    expect(group?.classList).toContain('search-segments');
  });

  describe('accessibility', () => {
    test.each([
      ['no parentPath specified', '', {}, {}],
      [
        'current segment matches parent path',
        'authorities',
        { [SearchParam.SEGMENT]: 'authorities' },
        { parentPath: 'authorities' },
      ],
      [
        'current segment does not match parent path',
        'resources',
        { [SearchParam.SEGMENT]: 'resources' },
        { parentPath: 'authorities' },
      ],
      ['custom className provided', '', {}, { className: 'custom-class' }],
    ])(
      'has no accessibility violations when %s',
      async (_description, currentSegment, navigationStateOverrides, props) => {
        mockCurrentSegment = currentSegment;
        setInitialGlobalState([
          {
            store: useSearchStore,
            state: { navigationState: navigationStateOverrides, setNavigationState },
          },
        ]);

        const { container } = render(
          <SegmentGroup {...props}>
            <button role="tab">Segment</button>
          </SegmentGroup>,
        );

        const results = await axe(container);

        expect(results).toHaveNoViolations();
      },
    );
  });
});
