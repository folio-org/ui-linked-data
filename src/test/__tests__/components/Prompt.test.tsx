import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { Prompt } from '@/components/Prompt';
import '@/test/__mocks__/common/hooks/useConfig.mock';
import { createModalContainer } from '@/test/__mocks__/common/misc/createModalContainer.mock';
import { setInitialGlobalState } from '@/test/__mocks__/store';

import { useConfigStore } from '@/store';

const mockedUseBlocker = {
  reset: jest.fn(),
  proceed: jest.fn(),
};

const setIsModalOpen = jest.fn();
const openModal = jest.fn();
const dispatchEvent = jest.fn();
const addEventListener = jest.fn();
const removeEventListener = jest.fn();

const mockedContainer = document.createElement('div');

jest.mock('@/common/hooks/useModalControls', () => ({
  useModalControls: () => ({
    isModalOpen: true,
    setIsModalOpen,
    openModal,
  }),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),

  useBlocker: (cb: any) => {
    cb({ nextLocation: { pathname: '/next/location', search: '' } });

    return mockedUseBlocker;
  },
}));

jest.mock('@/common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: true }));

jest.mock('@/common/helpers/dom.helper', () => ({
  ...jest.requireActual('@/common/helpers/dom.helper'),
  getWrapperAsWebComponent: () => ({
    dispatchEvent,
    addEventListener,
    removeEventListener,
  }),
}));

const mockPath = '/resources/:resourceId/edit';

const renderPrompt = (isBlocking = true) => {
  setInitialGlobalState([
    {
      store: useConfigStore,
      state: { customEvents: { TRIGGER_MODAL: 'triggermodal' } },
    },
  ]);

  return render(
    <RouterProvider
      router={createMemoryRouter([{ path: mockPath, element: <Prompt when={isBlocking} /> }], {
        initialEntries: [mockPath],
      })}
    />,
  );
};

describe('Prompt', () => {
  beforeAll(() => {
    createModalContainer();
  });

  beforeEach(() => {
    renderPrompt();
  });

  test('prompt is open if "when" arg is true', () => {
    expect(openModal).toHaveBeenCalled();
    expect(screen.getAllByTestId('modal-close-record-content')[0]).toBeInTheDocument();
  });

  test('stops navigation', () => {
    fireEvent.click(screen.getAllByTestId('modal-button-cancel')[0]);

    expect(setIsModalOpen).toHaveBeenCalled();
  });

  test('proceeds navigation', async () => {
    fireEvent.click(screen.getAllByTestId('modal-button-submit')[0]);

    await waitFor(() => expect(setIsModalOpen).toHaveBeenCalled());
  });

  test('manages event listeners', () => {
    mockedContainer.dispatchEvent(new CustomEvent('triggermodal'));

    expect(addEventListener).toHaveBeenCalled();
  });
});
