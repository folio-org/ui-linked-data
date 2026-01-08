import { render, screen, fireEvent } from '@testing-library/react';
import { setInitialGlobalState } from '@/test/__mocks__/store';
import { SearchParam } from '@/features/search/core';
import { useSearchStore } from '@/store';
import { Segment } from './Segment';

const mockOnSegmentChange = jest.fn();
let mockCurrentSegment = '';

jest.mock('../../providers/SearchProvider', () => ({
  useSearchContext: () => ({
    onSegmentChange: mockOnSegmentChange,
    currentSegment: mockCurrentSegment,
  }),
}));

jest.mock('react-intl', () => ({
  FormattedMessage: ({ id }: { id: string }) => <span>{id}</span>,
}));

describe('Segment', () => {
  const setNavigationState = jest.fn();

  beforeEach(() => {
    mockCurrentSegment = '';
  });

  describe('rendering', () => {
    it('renders button with derived label from path', () => {
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: { navigationState: {}, setNavigationState },
        },
      ]);

      render(<Segment path="resources" />);

      expect(screen.getByText('ld.resources')).toBeInTheDocument();
    });

    it('renders button with custom labelId', () => {
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: { navigationState: {}, setNavigationState },
        },
      ]);

      render(<Segment path="resources" labelId="custom.label" />);

      expect(screen.getByText('custom.label')).toBeInTheDocument();
    });

    it('renders custom children instead of label', () => {
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: { navigationState: {}, setNavigationState },
        },
      ]);

      render(
        <Segment path="resources">
          <span>Custom Content</span>
        </Segment>,
      );

      expect(screen.getByText('Custom Content')).toBeInTheDocument();
      expect(screen.queryByText('ld.resources')).not.toBeInTheDocument();
    });

    it('derives label from composite path', () => {
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: { navigationState: {}, setNavigationState },
        },
      ]);

      render(<Segment path="authorities:search" />);

      expect(screen.getByText('ld.search')).toBeInTheDocument();
    });

    it('uses custom testId when provided', () => {
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: { navigationState: {}, setNavigationState },
        },
      ]);

      render(<Segment path="resources" testId="custom-test-id" />);

      expect(screen.getByTestId('custom-test-id')).toBeInTheDocument();
    });

    it('generates default testId from path', () => {
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: { navigationState: {}, setNavigationState },
        },
      ]);

      render(<Segment path="authorities:search" />);

      expect(screen.getByTestId('id-search-segment-button-authorities:search')).toBeInTheDocument();
    });
  });

  describe('active state', () => {
    it('renders button with Highlighted type when segment matches path', () => {
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

      render(<Segment path="resources" />);

      const button = screen.getByTestId('id-search-segment-button-resources');
      expect(button).toHaveClass('search-segment-button');
    });

    it('renders button with Primary type for parent segment when child is active', () => {
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

      render(<Segment path="authorities" />);

      const button = screen.getByTestId('id-search-segment-button-authorities');
      expect(button).toHaveClass('search-segment-button');
    });

    it('renders button with Primary type when segment does not match', () => {
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

      render(<Segment path="resources" />);

      const button = screen.getByTestId('id-search-segment-button-resources');
      expect(button).toHaveClass('search-segment-button');
    });
  });

  describe('click handling', () => {
    it('calls onSegmentChange with path when clicked', () => {
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: { navigationState: {}, setNavigationState },
        },
      ]);

      render(<Segment path="resources" />);

      const button = screen.getByTestId('id-search-segment-button-resources');
      fireEvent.click(button);

      expect(mockOnSegmentChange).toHaveBeenCalledWith('resources');
    });

    it('calls onSegmentChange with defaultTo path when provided', () => {
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: { navigationState: {}, setNavigationState },
        },
      ]);

      render(<Segment path="authorities" defaultTo="authorities:search" />);

      const button = screen.getByTestId('id-search-segment-button-authorities');
      fireEvent.click(button);

      expect(mockOnSegmentChange).toHaveBeenCalledWith('authorities:search');
    });

    it('does not call onSegmentChange when clicking already active segment', () => {
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

      render(<Segment path="resources" />);

      const button = screen.getByTestId('id-search-segment-button-resources');
      fireEvent.click(button);

      expect(mockOnSegmentChange).not.toHaveBeenCalled();
    });

    it('does not call onSegmentChange when clicking active segment with defaultTo', () => {
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

      render(<Segment path="authorities" defaultTo="authorities:search" />);

      const button = screen.getByTestId('id-search-segment-button-authorities');
      fireEvent.click(button);

      expect(mockOnSegmentChange).not.toHaveBeenCalled();
    });
  });
});
