import { ViewMarcControlPane } from '@components/ViewMarcControlPane';
import { render } from '@testing-library/react';
import { RecoilRoot } from 'recoil';

describe('ViewMarcControlPane', () => {
  test('renders the pane', () => {
    const { getByTestId } = render(
      <RecoilRoot>
        <ViewMarcControlPane />
      </RecoilRoot>,
    );

    expect(getByTestId('view-marc-control-pane')).toBeInTheDocument();
  });
});
