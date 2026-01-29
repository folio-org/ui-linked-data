import { setInitialGlobalState } from '@/test/__mocks__/store';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { StatusType } from '@/common/constants/status.constants';
import { CommonStatus } from '@/components/CommonStatus';

import { useStatusStore } from '@/store';

describe('CommonStatus', () => {
  const renderComponent = (statusMessages: StatusEntry[] = []) => {
    setInitialGlobalState([
      {
        store: useStatusStore,
        state: { statusMessages },
      },
    ]);

    return render(<CommonStatus />);
  };

  const getStatusMessagesCount = (container: HTMLElement) => container.querySelectorAll('.status-message').length;

  test('does not render "CommonStatus" component', () => {
    renderComponent();

    expect(screen.queryByTestId('common-status')).not.toBeInTheDocument();
  });

  test('renders 3 status messages', () => {
    const statusMessages = [
      { id: '01', type: StatusType.success, message: 'test message 1' },
      { id: '02', type: StatusType.error, message: 'test message 2' },
      { id: '03', type: StatusType.warning, message: 'test message 3' },
    ];

    const { container } = renderComponent(statusMessages);

    expect(screen.getByTestId('common-status')).toBeInTheDocument();
    expect(getStatusMessagesCount(container)).toBe(3);
  });

  test('deletes a status message on click "Close" button', async () => {
    const statusMessages = [
      { id: '01', type: StatusType.success, message: 'test message 1' },
      { id: '02', type: StatusType.error, message: 'test message 2' },
    ];

    const { container } = renderComponent(statusMessages);
    const button = screen.getAllByRole('button')[0];

    expect(getStatusMessagesCount(container)).toBe(2);

    fireEvent.click(button);

    await waitFor(() => {
      expect(getStatusMessagesCount(container)).toBe(1);
    });
  });
});
