import { render } from '@testing-library/react';
import { axe } from 'jest-axe';

import { RecordControls } from './RecordControls';

jest.mock('../SaveRecord', () => ({
  SaveRecord: ({ locally }: any) => <div data-testid={`save-record${locally ? '-locally' : ''}-component`} />,
}));

jest.mock('../CloseRecord', () => ({
  CloseRecord: () => <div data-testid="close-record-component" />,
}));

describe('RecordControls', () => {
  xtest('renders proper components', () => {
    const { getByTestId } = render(<RecordControls />);

    expect(getByTestId('save-record-component')).toBeInTheDocument();
    expect(getByTestId('close-record-component')).toBeInTheDocument();
  });

  describe('accessibility', () => {
    test('has no accessibility violations', async () => {
      const { container } = render(<RecordControls />);

      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });
  });
});
