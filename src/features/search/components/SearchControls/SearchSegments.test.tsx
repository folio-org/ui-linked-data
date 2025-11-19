import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import { SearchSegments, useSearchContext } from '@/features/search';

jest.mock('@/features/search/providers');
jest.mock('@/common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: false }));

describe('SearchSegments Component', () => {
  const mockSetSelectedNavigationSegment = jest.fn();
  const mockOnChangeSegment = jest.fn();

  beforeEach(() => {
    (useSearchContext as jest.Mock).mockReturnValue({
      primarySegments: {
        segment_1: { labelId: 'label_1' },
        segment_2: { labelId: 'label_2' },
      },
      navigationSegment: {
        value: 'segment_1',
        set: mockSetSelectedNavigationSegment,
      },
    });
  });

  test('renders the component with the correct segments', () => {
    const { getByText } = render(<SearchSegments />);

    expect(getByText('label_1')).toBeInTheDocument();
    expect(getByText('label_2')).toBeInTheDocument();
  });

  test('calls "setSelectedNavigationSegment" and "onChangeSegment" when a different segment is clicked', () => {
    const { getByTestId } = render(<SearchSegments onChangeSegment={mockOnChangeSegment} />);
    const segmentButton = getByTestId('id-search-segment-button-segment_2');

    fireEvent.click(segmentButton);

    expect(mockSetSelectedNavigationSegment).toHaveBeenCalledWith('segment_2');
    expect(mockOnChangeSegment).toHaveBeenCalledWith('segment_2');
  });

  test('does not call "setSelectedNavigationSegment" or "onChangeSegment" when the selected segment is clicked', () => {
    const { getByTestId } = render(<SearchSegments onChangeSegment={mockOnChangeSegment} />);
    const segmentButton = getByTestId('id-search-segment-button-segment_1');

    fireEvent.click(segmentButton);

    expect(mockSetSelectedNavigationSegment).not.toHaveBeenCalled();
    expect(mockOnChangeSegment).not.toHaveBeenCalled();
  });
});
