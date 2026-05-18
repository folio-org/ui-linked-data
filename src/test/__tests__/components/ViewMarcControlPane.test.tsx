import { render } from '@testing-library/react';

import { ViewMarcControlPane } from '@/features/edit/components/ViewMarcControlPane';

describe('ViewMarcControlPane', () => {
  test('renders the pane', () => {
    const { getByTestId } = render(<ViewMarcControlPane />);

    expect(getByTestId('view-marc-control-pane')).toBeInTheDocument();
  });
});
