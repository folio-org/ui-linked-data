import { createModalContainer } from '@src/test/__mocks__/components/Modal.mock';
import { render, screen } from '@testing-library/react';
import { Prompt } from '@components/Prompt';

jest.mock('react-router-dom');

describe('Prompt', () => {
  beforeAll(() => {
    createModalContainer();
  });

  test('renders Prompt component', () => {
    render(<Prompt when={false} />);

    expect(screen.getByTestId('modal-component')).toBeInTheDocument();
  });
});
