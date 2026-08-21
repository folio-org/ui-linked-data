import { saveRecord } from '@/test/__mocks__/features/resources/hooks/useRecordMutations.mock';
import { setInitialGlobalState } from '@/test/__mocks__/store';

import { BrowserRouter } from 'react-router-dom';

import { fireEvent, render, screen } from '@testing-library/react';

import { useStatusStore } from '@/store';

import { SaveRecord } from '.';

describe('SaveRecord', () => {
  function renderSaveRecordComponent(isRecordEdited = true) {
    setInitialGlobalState([
      {
        store: useStatusStore,
        state: { isRecordEdited },
      },
    ]);

    render(
      <BrowserRouter>
        <SaveRecord primary />
      </BrowserRouter>,
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
