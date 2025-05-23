import { render, screen, fireEvent } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { ModalImport } from '@components/ModalImport';
import { ImportModes } from '@common/constants/import.constants';
import { createModalContainer } from '@src/test/__mocks__/common/misc/createModalContainer.mock';
import { setInitialGlobalState } from '@src/test/__mocks__/store';
import { useUIStore } from '@src/store';
import * as importApi from '@common/api/import.api';

describe('ModalImport', () => {
  const user = userEvent.setup();
  const file = new File(['{}'], 'resources.json', { type: 'application/json' });
  let importFileMock = jest.fn();

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
    render(<ModalImport />);
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
    expect(screen.getByTestId('modal-button-submit')).toBeDisabled();
  });

  test('successful import shows done button which closes modal', async () => {
    jest.useFakeTimers({ advanceTimers: true });
    importFileMock.mockResolvedValueOnce(null);
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

  test('failed import shows try again button which resets modal state', async () => {
    importFileMock.mockRejectedValueOnce(null);
    const input = screen.getByTestId('dropzone-file-input');
    await user.upload(input, file);
    await user.click(screen.getByTestId('modal-button-submit'));
    expect(screen.getByTestId('modal-import-completed')).toBeInTheDocument();
    expect(screen.getByTestId('modal-button-cancel')).toBeInTheDocument();
    expect(screen.getByTestId('modal-button-submit')).toBeEnabled();
    await user.click(screen.getByTestId('modal-button-submit'));
    expect(screen.getByTestId('modal-import-file-mode')).toBeInTheDocument();
  });
});
