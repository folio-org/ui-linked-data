import { openModal } from '@src/test/__mocks__/useModalControls.mock';
import '@src/test/__mocks__/useRecordControls.mock';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RecoilRoot } from 'recoil';
import state from '@state';
import { DeleteRecord } from '@components/DeleteRecord';

describe('DeleteRecord', () => {
  const mockedRecord = {
    id: 'testId',
    profile: 'testProfile',
  } as RecordEntry;

  const renderComponent = (recordState: RecordEntry | null) =>
    render(
      <RecoilRoot initializeState={snapshot => snapshot.set(state.inputs.record, recordState)}>
        <DeleteRecord />
      </RecoilRoot>,
    );

  const getButtonElement = () => screen.getByTestId('delete-record-button');

  test('renders "Delete record" button and it is not disabled', () => {
    renderComponent(mockedRecord);

    const button = getButtonElement();

    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  test('renders disabled "Delete record" button', () => {
    renderComponent(null);

    expect(getButtonElement()).toBeDisabled();
  });

  test('triggers "openModal" function', () => {
    renderComponent(mockedRecord);
    fireEvent.click(getButtonElement());

    expect(openModal).toHaveBeenCalledTimes(1);
  });
});
