import { fireEvent, render, screen } from '@testing-library/react';
import { Prompt } from '@components/Prompt';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { createModalContainer } from '@src/test/__mocks__/common/misc/createModalContainer.mock';
import { RecoilRoot } from 'recoil';

const mockedUseBlocker = {
  reset: jest.fn(),
  proceed: jest.fn(),
};

const setIsModalOpen = jest.fn();
const openModal = jest.fn();
const dispatchEvent = jest.fn();
const addEventListener = jest.fn();

const mockedContainer = document.createElement('div');

jest.mock('@common/hooks/useModalControls', () => ({
  useModalControls: () => ({
    isModalOpen: true,
    setIsModalOpen,
    openModal,
  }),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),

  useBlocker: (cb: any) => {
    cb();

    return mockedUseBlocker;
  },
}));

jest.mock('@common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: true }));

jest.mock('@common/helpers/dom.helper', () => ({
  getWrapperAsWebComponent: () => ({
    dispatchEvent,
    addEventListener,
  }),
}));

const renderPrompt = (isBlocking = true) =>
  render(
    <RecoilRoot>
      <RouterProvider
        router={createMemoryRouter([{ path: '/', element: <Prompt when={isBlocking} /> }], { initialEntries: ['/'] })}
      />
    </RecoilRoot>,
  );

describe('Prompt', () => {
  beforeAll(() => {
    createModalContainer();
  });

  beforeEach(() => {
    renderPrompt();
  });

  test('prompt is open if "when" arg is true', () => {
    expect(openModal).toHaveBeenCalled();
    expect(screen.getByTestId('modal-close-record-content')).toBeInTheDocument();
  });

  test('stops navigation', () => {
    fireEvent.click(screen.getByTestId('modal-button-cancel'));

    expect(setIsModalOpen).toHaveBeenCalled();
  });

  test('proceeds navigation', () => {
    fireEvent.click(screen.getByTestId('modal-button-submit'));

    expect(setIsModalOpen).toHaveBeenCalled();
  });

  test('manages event listeners', () => {
    mockedContainer.dispatchEvent(new CustomEvent('triggermodal'));

    expect(addEventListener).toHaveBeenCalled();
  });
});
