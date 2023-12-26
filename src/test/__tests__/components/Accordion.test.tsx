import { Accordion } from '@components/Accordion';
import { fireEvent, render } from '@testing-library/react';

const mockContent = 'mock-content';

describe('Accordion', () => {
  test('closes on header click', () => {
    const { getByTestId, queryByTestId } = render(<Accordion children={mockContent} />);

    fireEvent.click(getByTestId('accordion-toggle-button'));

    expect(queryByTestId('accordion-contents')).toHaveProperty('hidden');
  });
});
