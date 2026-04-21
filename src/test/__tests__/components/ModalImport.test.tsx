import { navigateToEditPage } from '@/test/__mocks__/common/hooks/useNavigateToEditPage.mock';
import { createModalContainer } from '@/test/__mocks__/common/misc/createModalContainer.mock';
import { setInitialGlobalState } from '@/test/__mocks__/store';

import { BrowserRouter } from 'react-router-dom';

import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import * as importApi from '@/common/api/import.api';
import { ImportFilterTypes, ImportModes } from '@/common/constants/import.constants';
import { StatusType } from '@/common/constants/status.constants';
import { UserNotificationFactory } from '@/common/services/userNotification';
import { ModalImport } from '@/components/ModalImport';

import { useUIStore } from '@/store';

jest.mock('@/common/services/userNotification', () => ({
  UserNotificationFactory: {
    createMessage: jest.fn(),
  },
}));

describe('ModalImport', () => {
  const user = userEvent.setup();
  const file = new File(['{}'], 'resources.json', { type: 'application/json' });
  const emptyFile = new File([], 'empty.json', { type: 'application/json' });
  const extensionlessFile = new File(['{}'], 'instance', { type: 'application/json' });
  let importFileMock = jest.fn();
  let importUrlMock = jest.fn();
  window.URL.createObjectURL = jest.fn();
  window.URL.revokeObjectURL = jest.fn();

  beforeAll(() => {
    createModalContainer();
  });

  beforeEach(() => {
    importFileMock = (jest.spyOn(importApi, 'importFile') as any).mockImplementation(() => Promise.resolve(null));
    importUrlMock = (jest.spyOn(importApi, 'importUrl') as any).mockImplementation(() => Promise.resolve(null));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const renderComponent = (filterType?: ImportFilterTypes) => {
    if (filterType === undefined) {
      filterType = ImportFilterTypes.Instance;
    }
    setInitialGlobalState([
      {
        store: useUIStore,
        state: {
          isImportModalOpen: true,
          importModalFilterType: filterType,
        },
      },
    ]);
    render(
      <BrowserRouter>
        <ModalImport />
      </BrowserRouter>,
    );
  };

  test('renders import window', () => {
    renderComponent();
    expect(screen.getByTestId('modal-import')).toBeInTheDocument();
  });

  test('initially in file import mode', () => {
    renderComponent();
    expect(screen.getByTestId('modal-import-file-mode')).toBeInTheDocument();
    expect(screen.queryByTestId('modal-import-url-mode')).not.toBeInTheDocument();
  });

  test('select change switches to URL import mode', () => {
    renderComponent();
    fireEvent.change(screen.getByTestId('modal-import-mode-selector'), { target: { value: ImportModes.JsonUrl } });
    expect(screen.queryByTestId('modal-import-file-mode')).not.toBeInTheDocument();
    expect(screen.getByTestId('modal-import-url-mode')).toBeInTheDocument();
  });

  describe('instance and hub import', () => {
    test('import a hub', () => {
      renderComponent(ImportFilterTypes.Hub);
      expect(screen.getByText('ld.importHubs')).toBeInTheDocument();
    });

    test('import an instance', () => {
      renderComponent(ImportFilterTypes.Instance);
      expect(screen.getByText('ld.importInstances')).toBeInTheDocument();
    });

    test('import a hub by url has no default work type filter', () => {
      renderComponent(ImportFilterTypes.Hub);
      fireEvent.change(screen.getByTestId('modal-import-mode-selector'), { target: { value: ImportModes.JsonUrl } });
      expect(screen.queryByTestId('default-work-type')).not.toBeInTheDocument();
    });

    test('import an instance by url has default work type filter', () => {
      renderComponent(ImportFilterTypes.Instance);
      fireEvent.change(screen.getByTestId('modal-import-mode-selector'), { target: { value: ImportModes.JsonUrl } });
      expect(screen.getByTestId('default-work-type')).toBeInTheDocument();
    });
  });

  describe('file import', () => {
    beforeEach(() => {
      renderComponent();
    });

    test('an added file enables import to proceed', async () => {
      const input = screen.getByTestId('dropzone-file-input');
      await user.upload(input, file);
      expect(screen.getByTestId('modal-button-submit')).toBeEnabled();
    });

    test('an empty file results in an error', async () => {
      const input = screen.getByTestId('dropzone-file-input');
      await user.upload(input, emptyFile);
      await user.click(screen.getByTestId('modal-button-submit'));
      await jest.advanceTimersToNextTimerAsync();
      expect(screen.getByTestId('modal-import-completed')).toBeInTheDocument();
      expect(UserNotificationFactory.createMessage).toHaveBeenCalledWith(StatusType.error, 'ld.importFileEmptyError');
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
      await user.upload(input, extensionlessFile);
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
      expect(UserNotificationFactory.createMessage).toHaveBeenCalledWith(StatusType.error, 'ld.importTimedout');
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

    test('successful import of no resources produces a warning', async () => {
      jest.useFakeTimers({ advanceTimers: true });
      importFileMock.mockResolvedValueOnce({ log: '' });
      const input = screen.getByTestId('dropzone-file-input');
      await user.upload(input, file);
      await user.click(screen.getByTestId('modal-button-submit'));
      await jest.advanceTimersToNextTimerAsync();
      expect(UserNotificationFactory.createMessage).toHaveBeenCalledWith(
        StatusType.warning,
        'ld.importNoResourcesWarning',
      );
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

  describe('URL import', () => {
    beforeEach(() => {
      renderComponent();
      fireEvent.change(screen.getByTestId('modal-import-mode-selector'), { target: { value: ImportModes.JsonUrl } });
    });

    test('providing a URL enables import to proceed', async () => {
      const input = screen.getByTestId('import-url-input');
      await user.type(input, 'some-test-url');
      expect(screen.getByTestId('modal-button-submit')).toBeEnabled();
    });

    test('actuate all inputs', async () => {
      const input = screen.getByTestId('import-url-input');
      await user.type(input, 'some-test-url');
      fireEvent.change(screen.getByTestId('default-work-type'), {
        target: { value: 'http://bibfra.me/vocab/library/ContinuingResources' },
      });
      await userEvent.clear(input);
      expect(screen.getByTestId('modal-button-submit')).not.toBeEnabled();
    });

    test('clicking import moves to loading message', async () => {
      const input = screen.getByTestId('import-url-input');
      await user.type(input, 'https://some-test-url/filename.json');
      await user.click(screen.getByTestId('modal-button-submit'));
      expect(importUrlMock).toHaveBeenCalled();
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
      importUrlMock.mockResolvedValueOnce({ resources: ['1'], log: '' });
      const input = screen.getByTestId('import-url-input');
      await user.type(input, 'some-test-url');
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
      importUrlMock = (jest.spyOn(importApi, 'importUrl') as any).mockImplementation(() => {
        setTimeout(() => {
          Promise.resolve(null);
        }, 90 * 1000);
      });
      const input = screen.getByTestId('import-url-input');
      await user.type(input, 'some-test-url');
      await user.click(screen.getByTestId('modal-button-submit'));
      await jest.advanceTimersToNextTimerAsync();
      expect(screen.getByTestId('modal-import-completed')).toBeInTheDocument();
      expect(UserNotificationFactory.createMessage).toHaveBeenCalledWith(StatusType.error, 'ld.importTimedout');
    });

    test('failed import shows try again button which resets modal state', async () => {
      importUrlMock.mockRejectedValueOnce(null);
      const input = screen.getByTestId('import-url-input');
      await user.type(input, 'some-test-url');
      await user.click(screen.getByTestId('modal-button-submit'));
      await jest.advanceTimersToNextTimerAsync();
      expect(screen.getByTestId('modal-import-completed')).toBeInTheDocument();
      expect(screen.getByTestId('modal-button-cancel')).toBeInTheDocument();
      expect(screen.getByTestId('modal-button-submit')).toBeEnabled();
      await user.click(screen.getByTestId('modal-button-submit'));
      await jest.advanceTimersToNextTimerAsync();
      expect(screen.getByTestId('modal-import-url-mode')).toBeInTheDocument();
    });

    test('successful import of no resources produces a warning', async () => {
      jest.useFakeTimers({ advanceTimers: true });
      importUrlMock.mockResolvedValueOnce({ log: '' });
      const input = screen.getByTestId('import-url-input');
      await user.type(input, 'some-test-url');
      await user.click(screen.getByTestId('modal-button-submit'));
      await jest.advanceTimersToNextTimerAsync();
      expect(UserNotificationFactory.createMessage).toHaveBeenCalledWith(
        StatusType.warning,
        'ld.importNoResourcesWarning',
      );
    });

    test('successful import of one resource navigates to edit the resource', async () => {
      jest.useFakeTimers({ advanceTimers: true });
      importUrlMock.mockResolvedValueOnce({ resources: ['1'], log: '' });
      const input = screen.getByTestId('import-url-input');
      await user.type(input, 'some-test-url');
      await user.click(screen.getByTestId('modal-button-submit'));
      await jest.advanceTimersToNextTimerAsync();
      await user.click(screen.getByTestId('modal-button-submit'));
      expect(navigateToEditPage).toHaveBeenCalled();
    });

    test('successful import of anything more than one resource does not navigate', async () => {
      jest.useFakeTimers({ advanceTimers: true });
      importUrlMock.mockResolvedValueOnce({ resources: ['1', '2', '3'], log: '' });
      const input = screen.getByTestId('import-url-input');
      await user.type(input, 'some-test-url');
      await user.click(screen.getByTestId('modal-button-submit'));
      await jest.advanceTimersToNextTimerAsync();
      await user.click(screen.getByTestId('modal-button-submit'));
      await jest.advanceTimersToNextTimerAsync();
      expect(navigateToEditPage).not.toHaveBeenCalled();
    });

    test('import creates activity log link element', async () => {
      const spy = jest.spyOn(document, 'createElement');
      jest.useFakeTimers({ advanceTimers: true });
      importUrlMock.mockResolvedValueOnce({ resources: ['1', '2'], log: '1' });
      const input = screen.getByTestId('import-url-input');
      await user.type(input, 'some-test-url');
      await user.click(screen.getByTestId('modal-button-submit'));
      await jest.advanceTimersToNextTimerAsync();
      expect(spy).toHaveBeenCalled();
    });
  });
});
