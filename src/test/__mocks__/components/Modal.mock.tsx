import { MODAL_CONTAINER_ID } from '@common/constants/uiElements.constants';

jest.mock('@components/Modal', () => ({
  Modal: () => <div data-testid="modal-component" />,
}));

export const createModalContainer = () => {
  const modalContainer = document.createElement('div');
  modalContainer.setAttribute('id', MODAL_CONTAINER_ID);
  document.body.appendChild(modalContainer);
};
