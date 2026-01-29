import { setInitialGlobalState } from '@/test/__mocks__/store';

import { render, screen } from '@testing-library/react';

import { SearchParam } from '@/features/search/core';

import { useSearchStore } from '@/store';

import { SegmentContent } from './SegmentContent';

let mockCurrentSegment = '';

jest.mock('../../providers/SearchProvider', () => ({
  useSearchContext: () => ({
    currentSegment: mockCurrentSegment,
  }),
}));

describe('SegmentContent', () => {
  const setNavigationState = jest.fn();

  beforeEach(() => {
    mockCurrentSegment = '';
  });

  describe('exact match (matchPrefix=false)', () => {
    it('renders children when current segment matches exactly', () => {
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

      render(
        <SegmentContent segment="resources">
          <div>Resources Content</div>
        </SegmentContent>,
      );

      expect(screen.getByText('Resources Content')).toBeInTheDocument();
    });

    it('does not render when segment does not match exactly', () => {
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

      const { container } = render(
        <SegmentContent segment="resources">
          <div>Resources Content</div>
        </SegmentContent>,
      );

      expect(container.firstChild).toBeNull();
    });

    it('does not render for prefix match when matchPrefix is false', () => {
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

      const { container } = render(
        <SegmentContent segment="authorities" matchPrefix={false}>
          <div>Authorities Content</div>
        </SegmentContent>,
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe('prefix match (matchPrefix=true)', () => {
    it('renders children when current segment matches exactly', () => {
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
        <SegmentContent segment="authorities" matchPrefix>
          <div>Authorities Content</div>
        </SegmentContent>,
      );

      expect(screen.getByText('Authorities Content')).toBeInTheDocument();
    });

    it('renders children when current segment has matching prefix', () => {
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
        <SegmentContent segment="authorities" matchPrefix>
          <div>Authorities Content</div>
        </SegmentContent>,
      );

      expect(screen.getByText('Authorities Content')).toBeInTheDocument();
    });

    it('renders for nested prefix matches', () => {
      mockCurrentSegment = 'authorities:search:advanced';
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: {
            navigationState: { [SearchParam.SEGMENT]: 'authorities:search:advanced' },
            setNavigationState,
          },
        },
      ]);

      render(
        <SegmentContent segment="authorities" matchPrefix>
          <div>Authorities Content</div>
        </SegmentContent>,
      );

      expect(screen.getByText('Authorities Content')).toBeInTheDocument();
    });

    it('does not render when prefix does not match', () => {
      mockCurrentSegment = 'resources:search';
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: {
            navigationState: { [SearchParam.SEGMENT]: 'resources:search' },
            setNavigationState,
          },
        },
      ]);

      const { container } = render(
        <SegmentContent segment="authorities" matchPrefix>
          <div>Authorities Content</div>
        </SegmentContent>,
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe('no current segment', () => {
    it('does not render when navigationState has no segment', () => {
      mockCurrentSegment = '';
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: { navigationState: {}, setNavigationState },
        },
      ]);

      const { container } = render(
        <SegmentContent segment="resources">
          <div>Content</div>
        </SegmentContent>,
      );

      expect(container.firstChild).toBeNull();
    });
  });
});
