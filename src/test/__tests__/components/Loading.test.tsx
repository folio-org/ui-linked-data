import { render } from '@testing-library/react';
import { axe } from 'jest-axe';

import { Loading } from '@/components/Loading';

describe('Loading', () => {
  test('renders Loading component', () => {
    const { container } = render(<Loading />);

    expect(container.querySelector('.loader-overlay')).toBeInTheDocument();
    expect(container.querySelector('.loader')).toBeInTheDocument();
  });

  describe('accessibility', () => {
    test('has no accessibility violations', async () => {
      const { container } = render(<Loading />);

      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });
  });
});
