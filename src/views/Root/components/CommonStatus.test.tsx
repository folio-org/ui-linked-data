import { setInitialGlobalState } from '@/test/__mocks__/store';

import { MemoryRouter } from 'react-router-dom';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { StatusType } from '@/common/constants/status.constants';

import { useStatusStore } from '@/store';

import { CommonStatus } from './CommonStatus';

const mockUseLocation = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => mockUseLocation(),
}));

describe('CommonStatus', () => {
  const renderComponent = (statusMessages: StatusEntry[] = [], location: string = '/') => {
    setInitialGlobalState([
      {
        store: useStatusStore,
        state: { statusMessages },
      },
    ]);

    mockUseLocation.mockReturnValue({ pathname: location });

    return render(
      <MemoryRouter initialEntries={[{ pathname: location }]}>
        <CommonStatus />
      </MemoryRouter>,
    );
  };

  const getStatusMessagesCount = (container: HTMLElement) => container.querySelectorAll('.status-message').length;

  afterEach(() => {
    jest.clearAllMocks();
  });

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

  test('clear notifications on location change', async () => {
    const statusMessages = [
      { id: '01', type: StatusType.success, message: 'test message 1' },
      { id: '02', type: StatusType.error, message: 'test message 2' },
    ];

    const { container, rerender } = renderComponent(statusMessages);

    expect(screen.getByTestId('common-status')).toBeInTheDocument();
    expect(getStatusMessagesCount(container)).toBe(2);

    mockUseLocation.mockReturnValue({ pathname: '/different', state: null });

    rerender(
      <MemoryRouter initialEntries={[{ pathname: '/different' }]}>
        <CommonStatus />
      </MemoryRouter>,
    );

    expect(screen.queryByTestId('common-status')).not.toBeInTheDocument();
  });

  test('preserves messages when navigating with preserveStatusMessages flag', async () => {
    const statusMessages = [{ id: '01', type: StatusType.success, message: 'ld.rdUpdateSuccess' }];

    const { container, rerender } = renderComponent(statusMessages, '/edit');

    expect(getStatusMessagesCount(container)).toBe(1);

    mockUseLocation.mockReturnValue({
      pathname: '/search',
      state: { preserveStatusMessages: true },
    });

    rerender(
      <MemoryRouter initialEntries={[{ pathname: '/search' }]}>
        <CommonStatus />
      </MemoryRouter>,
    );

    expect(getStatusMessagesCount(container)).toBe(1);
    expect(screen.getByText('ld.rdUpdateSuccess')).toBeInTheDocument();
  });
});
