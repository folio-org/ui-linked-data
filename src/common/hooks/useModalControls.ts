import { useState } from 'react';

export const useModalControls = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    !isModalOpen && setIsModalOpen(true);
  };

  const closeModal = () => {
    isModalOpen && setIsModalOpen(false);
  };

  return { isModalOpen, setIsModalOpen, openModal, closeModal };
};
