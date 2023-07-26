import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RecoilRoot } from 'recoil';
import state from '@state';
import { DeleteRecord } from '@components/DeleteRecord';
import { openModal } from '@src/test/__mock__/useModalControls.mock';

describe('DeleteRecord', () => {
  const mockRecord = {
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
    renderComponent(mockRecord);

    const button = getButtonElement();

    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  test('renders disabled "Delete record" button', () => {
    renderComponent(null);

    expect(getButtonElement()).toBeDisabled();
  });

  test('triggers "openModal" function', () => {
    renderComponent(mockRecord);
    fireEvent.click(getButtonElement());

    expect(openModal).toHaveBeenCalledTimes(1);
  });
});
