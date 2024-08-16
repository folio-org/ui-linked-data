import { RecoilRoot } from 'recoil';
import { render, screen, fireEvent } from '@testing-library/react';
import { saveRecord } from '@src/test/__mocks__/common/hooks/useRecordControls.mock';
import { SaveRecord } from '@components/SaveRecord';
import state from '@state';

describe('SaveRecord', () => {
  function renderSaveRecordComponent(recordIsEdited = true, recordIsInitiallyLoaded = true) {
    render(
      <RecoilRoot
        initializeState={snapshot => {
          snapshot.set(state.status.recordIsInitiallyLoaded, recordIsInitiallyLoaded);
          snapshot.set(state.status.recordIsEdited, recordIsEdited);
        }}
      >
        <SaveRecord primary />
      </RecoilRoot>,
    );
  }

  test('renders enabled "Save and close" button', () => {
    renderSaveRecordComponent();

    expect(screen.getByTestId('save-record-and-close')).toBeInTheDocument();
    expect(screen.getByTestId('save-record-and-close')).not.toBeDisabled();
  });

  test('renders disabled "Save and close" button', () => {
    renderSaveRecordComponent(false);

    expect(screen.getByTestId('save-record-and-close')).toBeDisabled();
  });

  test('triggers "saveRecord" function', () => {
    renderSaveRecordComponent();

    fireEvent.click(screen.getByTestId('save-record-and-close'));

    expect(saveRecord).toHaveBeenCalledTimes(1);
  });
});
