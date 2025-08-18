import { navigateToEditPage } from '@src/test/__mocks__/common/hooks/useNavigateToEditPage.mock';
import { render, screen, fireEvent } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { ModalImport } from '@components/ModalImport';
import { ImportModes } from '@common/constants/import.constants';
import { createModalContainer } from '@src/test/__mocks__/common/misc/createModalContainer.mock';
import { setInitialGlobalState } from '@src/test/__mocks__/store';
import { useUIStore } from '@src/store';
import * as importApi from '@common/api/import.api';
import { BrowserRouter } from 'react-router-dom';

describe('ModalImport', () => {
  const user = userEvent.setup();
  const file = new File(['{}'], 'resources.json', { type: 'application/json' });
  let importFileMock = jest.fn();
  window.URL.createObjectURL = jest.fn();
  window.URL.revokeObjectURL = jest.fn();

  beforeAll(() => {
    createModalContainer();
  });

  beforeEach(() => {
    importFileMock = (jest.spyOn(importApi, 'importFile') as any).mockImplementation(() => Promise.resolve(null));
    setInitialGlobalState([
      {
        store: useUIStore,
        state: { isImportModalOpen: true },
      },
    ]);
    render(
      <BrowserRouter>
        <ModalImport />
      </BrowserRouter>,
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('renders import window', () => {
    expect(screen.getByTestId('modal-import')).toBeInTheDocument();
  });

  test('initially in file import mode', () => {
    expect(screen.getByTestId('modal-import-file-mode')).toBeInTheDocument();
    expect(screen.queryByTestId('modal-import-url-mode')).not.toBeInTheDocument();
  });

  test('select change switches to URL import mode', () => {
    fireEvent.change(screen.getByTestId('modal-import-mode-selector'), { target: { value: ImportModes.JsonUrl } });
    expect(screen.queryByTestId('modal-import-file-mode')).not.toBeInTheDocument();
    expect(screen.getByTestId('modal-import-url-mode')).toBeInTheDocument();
  });

  test('an added file enables import to proceed', async () => {
    const input = screen.getByTestId('dropzone-file-input');
    await user.upload(input, file);
    expect(screen.getByTestId('modal-button-submit')).toBeEnabled();
  });

  test('clicking import moves to loading message', async () => {
    const input = screen.getByTestId('dropzone-file-input');
    await user.upload(input, file);
    await user.click(screen.getByTestId('modal-button-submit'));
    expect(importFileMock).toHaveBeenCalled();
    expect(screen.getByTestId('modal-import-waiting')).toBeInTheDocument();
    // Verify all modal close actions have been disabled
    expect(screen.getByTestId('modal-button-submit')).toBeDisabled();
    expect(screen.getByTestId('modal-button-cancel')).toBeDisabled();
    await user.click(screen.getByTestId('modal-overlay'));
    expect(screen.getByTestId('modal-import')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.getByTestId('modal-import')).toBeInTheDocument();
  });

  test('successful import shows done button which closes modal', async () => {
    jest.useFakeTimers({ advanceTimers: true });
    importFileMock.mockResolvedValueOnce({ resources: ['1'], log: '' });
    const input = screen.getByTestId('dropzone-file-input');
    await user.upload(input, file);
    await user.click(screen.getByTestId('modal-button-submit'));
    await jest.advanceTimersToNextTimerAsync();
    expect(screen.getByTestId('modal-import-completed')).toBeInTheDocument();
    expect(screen.queryByTestId('modal-button-cancel')).not.toBeInTheDocument();
    expect(screen.getByTestId('modal-button-submit')).toBeEnabled();
    await user.click(screen.getByTestId('modal-button-submit'));
    expect(screen.queryByTestId('modal-import')).not.toBeInTheDocument();
  });

  test('import timeout progresses to failed load state', async () => {
    jest.useFakeTimers({ advanceTimers: true });
    importFileMock = (jest.spyOn(importApi, 'importFile') as any).mockImplementation(() => {
      setTimeout(() => {
        Promise.resolve(null);
      }, 90 * 1000);
    });
    const input = screen.getByTestId('dropzone-file-input');
    await user.upload(input, file);
    await user.click(screen.getByTestId('modal-button-submit'));
    await jest.advanceTimersToNextTimerAsync();
    expect(screen.getByTestId('modal-import-completed')).toBeInTheDocument();
  });

  test('failed import shows try again button which resets modal state', async () => {
    importFileMock.mockRejectedValueOnce(null);
    const input = screen.getByTestId('dropzone-file-input');
    await user.upload(input, file);
    await user.click(screen.getByTestId('modal-button-submit'));
    await jest.advanceTimersToNextTimerAsync();
    expect(screen.getByTestId('modal-import-completed')).toBeInTheDocument();
    expect(screen.getByTestId('modal-button-cancel')).toBeInTheDocument();
    expect(screen.getByTestId('modal-button-submit')).toBeEnabled();
    await user.click(screen.getByTestId('modal-button-submit'));
    await jest.advanceTimersToNextTimerAsync();
    expect(screen.getByTestId('modal-import-file-mode')).toBeInTheDocument();
  });

  test('successful import of one resource navigates to edit the resource', async () => {
    jest.useFakeTimers({ advanceTimers: true });
    importFileMock.mockResolvedValueOnce({ resources: ['1'], log: '' });
    const input = screen.getByTestId('dropzone-file-input');
    await user.upload(input, file);
    await user.click(screen.getByTestId('modal-button-submit'));
    await jest.advanceTimersToNextTimerAsync();
    await user.click(screen.getByTestId('modal-button-submit'));
    expect(navigateToEditPage).toHaveBeenCalled();
  });

  test('successful import of anything other than one resource does not navigate', async () => {
    jest.useFakeTimers({ advanceTimers: true });
    importFileMock.mockResolvedValueOnce({ resources: ['1', '2', '3'], log: '' });
    const input = screen.getByTestId('dropzone-file-input');
    await user.upload(input, file);
    await user.click(screen.getByTestId('modal-button-submit'));
    await jest.advanceTimersToNextTimerAsync();
    await user.click(screen.getByTestId('modal-button-submit'));
    await jest.advanceTimersToNextTimerAsync();
    expect(navigateToEditPage).not.toHaveBeenCalled();
  });

  test('import creates activity log link element', async () => {
    const spy = jest.spyOn(document, 'createElement');
    jest.useFakeTimers({ advanceTimers: true });
    importFileMock.mockResolvedValueOnce({ resources: ['1', '2'], log: '1' });
    const input = screen.getByTestId('dropzone-file-input');
    await user.upload(input, file);
    await user.click(screen.getByTestId('modal-button-submit'));
    await jest.advanceTimersToNextTimerAsync();
    expect(spy).toHaveBeenCalled();
  });
});
