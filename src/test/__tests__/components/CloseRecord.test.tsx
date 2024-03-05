import { discardRecord } from '@src/test/__mocks__/common/hooks/useRecordControls.mock';
import '@src/test/__mocks__/common/hooks/useRecordControls.mock';
import '@src/test/__mocks__/components/Modal.mock';
import { fireEvent, render, screen } from '@testing-library/react';
import { CloseRecord } from '@components/CloseRecord';

describe('CloseRecord', () => {
  beforeEach(() => render(<CloseRecord />));

  test('renders "Close record" button', () => {
    expect(screen.getByTestId('close-record-button')).toBeInTheDocument();
  });

  test('triggers "openModal" function', () => {
    fireEvent.click(screen.getByTestId('close-record-button'));

    expect(discardRecord).toHaveBeenCalledTimes(1);
  });
});
