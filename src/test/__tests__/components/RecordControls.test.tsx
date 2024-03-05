import { render } from '@testing-library/react';
import { RecordControls } from '@components/RecordControls';
import { RecoilRoot } from 'recoil';
import state from '@state';

jest.mock('@components/SaveRecord', () => ({
  SaveRecord: ({ locally }: any) => <div data-testid={`save-record${locally ? '-locally' : ''}-component`} />,
}));

jest.mock('@components/CloseRecord', () => ({
  CloseRecord: () => <div data-testid="close-record-component" />,
}));

describe('RecordControls', () => {
  test('renders proper components', () => {
    const { getByTestId } = render(
      <RecoilRoot initializeState={snapshot => snapshot.set(state.ui.isEditSectionOpen, true)}>
        <RecordControls />
      </RecoilRoot>,
    );

    expect(getByTestId('save-record-component')).toBeInTheDocument();
    expect(getByTestId('close-record-component')).toBeInTheDocument();
  });
});
