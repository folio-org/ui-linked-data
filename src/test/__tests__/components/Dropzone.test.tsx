import { fireEvent, render, screen, act } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Dropzone } from '@components/Dropzone';

describe('Dropzone', () => {
  const user = userEvent.setup();
  const acceptableFile = new File(['{}'], 'resources.json', { type: 'application/json' });
  const rejectableFile = new File([''], 'not-json.txt', { type: 'text/plain' });

  beforeEach(() => {
    render(<Dropzone />)
  });

  test('renders dropzone', () => {
    expect(screen.getByTestId('dropzone-wrapper')).toBeInTheDocument();
  });

  test('displays an error when dragging an unrecognized file type', async () => {
    const data = {
      dataTransfer: {
        files: [rejectableFile],
        items: [{
          kind: 'file',
          type: 'text/plain',
          getAsFile: () => rejectableFile
        }],
        types: ['Files'],
      },
    };
    await act(() => {
      fireEvent.dragEnter(screen.getByTestId('dropzone'), data);
      fireEvent.dragOver(screen.getByTestId('dropzone'), data);
    });
    expect(screen.getByTestId('dropzone-error')).toBeInTheDocument();
  });

  test('accepts a compatible file and displays it', async () => {
    const input = screen.getByTestId('dropzone-file-input');
    await user.upload(input, acceptableFile);
    expect(screen.getByTestId('dropzone-file')).toBeInTheDocument();
  });

  test('removes an accepted file and returns to initial state', async () => {
    const input = screen.getByTestId('dropzone-file-input');
    await user.upload(input, acceptableFile);
    await fireEvent.click(screen.getByTestId('dropzone-file-remove'));
    expect(screen.queryByTestId('dropzone-file')).not.toBeInTheDocument();
  });
});
