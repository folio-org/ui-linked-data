import { render, screen } from '@testing-library/react';
import { setInitialGlobalState } from '@/test/__mocks__/store';
import { SearchParam } from '@/features/search/core';
import { useSearchStore } from '@/store';
import { SegmentContent } from './SegmentContent';

describe('SegmentContent', () => {
  const setNavigationState = jest.fn();

  describe('exact match (matchPrefix=false)', () => {
    it('renders children when current segment matches exactly', () => {
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
