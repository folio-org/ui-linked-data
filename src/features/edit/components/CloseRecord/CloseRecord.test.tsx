import '@/test/__mocks__/components/Modal.mock';
import { discardRecord } from '@/test/__mocks__/features/resources/hooks/useRecordNavigation.mock';

import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';

import { CloseRecord } from '.';

describe('CloseRecord', () => {
  let container: HTMLElement;

  beforeEach(() => {
    ({ container } = render(<CloseRecord />));
  });

  test('renders "Close record" button', () => {
    expect(screen.getByTestId('close-record-button')).toBeInTheDocument();
  });

  test('triggers "openModal" function', () => {
    fireEvent.click(screen.getByTestId('close-record-button'));

    expect(discardRecord).toHaveBeenCalledTimes(1);
  });

  describe('accessibility', () => {
    test('has no accessibility violations', async () => {
      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });
  });
});
