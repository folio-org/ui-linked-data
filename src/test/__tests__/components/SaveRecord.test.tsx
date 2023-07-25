import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SaveRecord } from '@components/SaveRecord';
import { saveRecord } from '@src/test/__mock__/useRecordControls.mock';

describe('SaveRecord', () => {
  beforeEach(() => render(<SaveRecord />));

  test('renders "Save record" button', () => {
    expect(screen.getByTestId('save-record-button')).toBeInTheDocument();
  });

  test('triggers "saveRecord" function', () => {
    fireEvent.click(screen.getByTestId('save-record-button'));

    expect(saveRecord).toHaveBeenCalledTimes(1);
  });
});
