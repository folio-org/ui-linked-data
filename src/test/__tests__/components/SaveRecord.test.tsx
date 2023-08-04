import { saveRecord } from '@src/test/__mocks__/common/hooks/useRecordControls.mock';
import { render, screen, fireEvent } from '@testing-library/react';
import { SaveRecord } from '@components/SaveRecord';

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
