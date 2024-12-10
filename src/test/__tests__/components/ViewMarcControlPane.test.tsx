import { ViewMarcControlPane } from '@components/ViewMarcControlPane';
import { render } from '@testing-library/react';

describe('ViewMarcControlPane', () => {
  test('renders the pane', () => {
    const { getByTestId } = render(<ViewMarcControlPane />);

    expect(getByTestId('view-marc-control-pane')).toBeInTheDocument();
  });
});
