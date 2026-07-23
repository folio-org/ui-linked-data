import { render } from '@testing-library/react';
import { axe } from 'jest-axe';

import { ViewMarcControlPane } from './ViewMarcControlPane';

describe('ViewMarcControlPane', () => {
  test('renders the pane', () => {
    const { getByTestId } = render(<ViewMarcControlPane />);

    expect(getByTestId('view-marc-control-pane')).toBeInTheDocument();
  });

  describe('accessibility', () => {
    test('has no accessibility violations', async () => {
      const { container } = render(<ViewMarcControlPane />);

      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });
  });
});
