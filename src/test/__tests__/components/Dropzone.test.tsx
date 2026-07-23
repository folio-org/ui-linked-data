import { act, fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { axe } from 'jest-axe';

import { Dropzone } from '@/components/Dropzone';

describe('Dropzone', () => {
  const user = userEvent.setup();
  const acceptableFile = new File(['{}'], 'resources.json', { type: 'application/json' });
  const rejectableFile = new File([''], 'not-json.txt', { type: 'text/plain' });

  let container: HTMLElement;

  beforeEach(() => {
    let files: File[] = [];
    let rerender: ReturnType<typeof render>['rerender'];
    const setFiles = (f: File[]) => {
      files = f;
      rerender(<Dropzone {...{ files, setFiles }} />);
    };
    ({ rerender, container } = render(<Dropzone {...{ files, setFiles }} />));
  });

  test('renders dropzone', () => {
    expect(screen.getByTestId('dropzone-wrapper')).toBeInTheDocument();
  });

  test('displays an error when dragging an unrecognized file type', async () => {
    const data = {
      dataTransfer: {
        files: [rejectableFile],
        items: [
          {
            kind: 'file',
            type: 'text/plain',
            getAsFile: () => rejectableFile,
          },
        ],
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
    fireEvent.click(screen.getByTestId('dropzone-file-remove'));
    expect(screen.queryByTestId('dropzone-file')).not.toBeInTheDocument();
  });

  describe('accessibility', () => {
    test('has no accessibility violations', async () => {
      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });
  });
});
