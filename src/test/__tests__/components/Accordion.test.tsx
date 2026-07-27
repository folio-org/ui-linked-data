import { fireEvent, render } from '@testing-library/react';
import { axe } from 'jest-axe';

import { Accordion } from '@/components/Accordion';

const mockContent = 'mock-content';

describe('Accordion', () => {
  test('closes on header click', () => {
    const { getByTestId, queryByTestId } = render(<Accordion children={mockContent} />);

    fireEvent.click(getByTestId('accordion-toggle-button'));

    expect(queryByTestId('accordion-contents')).toHaveProperty('hidden');
  });

  describe('accessibility', () => {
    test('has no accessibility violations', async () => {
      const { container } = render(<Accordion children={mockContent} title="test" />);

      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });

    test('has no accessibility violations when closed', async () => {
      const { container, getByTestId } = render(<Accordion children={mockContent} title="test" />);

      fireEvent.click(getByTestId('accordion-toggle-button'));

      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });
  });
});
