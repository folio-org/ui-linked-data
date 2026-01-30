import { render } from '@testing-library/react';

import { RecordControls } from '@/components/RecordControls';

jest.mock('@/components/SaveRecord', () => ({
  SaveRecord: ({ locally }: any) => <div data-testid={`save-record${locally ? '-locally' : ''}-component`} />,
}));

jest.mock('@/components/CloseRecord', () => ({
  CloseRecord: () => <div data-testid="close-record-component" />,
}));

describe('RecordControls', () => {
  xtest('renders proper components', () => {
    const { getByTestId } = render(<RecordControls />);

    expect(getByTestId('save-record-component')).toBeInTheDocument();
    expect(getByTestId('close-record-component')).toBeInTheDocument();
  });
});
