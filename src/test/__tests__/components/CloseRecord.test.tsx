import { openModal } from '@src/test/__mocks__/useModalControls.mock';
import '@src/test/__mocks__/useRecordControls.mock';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CloseRecord } from '@components/CloseRecord';

describe('CloseRecord', () => {
  beforeEach(() => render(<CloseRecord />));

  test('renders "Close record button"', () => {
    expect(screen.getByTestId('close-record-button')).toBeInTheDocument();
  });

  test('triggers "openModal" function', () => {
    fireEvent.click(screen.getByTestId('close-record-button'));

    expect(openModal).toHaveBeenCalledTimes(1);
  });
});
