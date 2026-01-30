import { MODAL_CONTAINER_ID } from '@/common/constants/uiElements.constants';

export const createModalContainer = () => {
  const modalContainer = document.createElement('div');
  modalContainer.setAttribute('id', MODAL_CONTAINER_ID);
  document.body.appendChild(modalContainer);
};
