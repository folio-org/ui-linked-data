import { render } from '@testing-library/react';

import { ViewMarcControlPane } from './ViewMarcControlPane';

describe('ViewMarcControlPane', () => {
  test('renders the pane', () => {
    const { getByTestId } = render(<ViewMarcControlPane />);

    expect(getByTestId('view-marc-control-pane')).toBeInTheDocument();
  });
});
