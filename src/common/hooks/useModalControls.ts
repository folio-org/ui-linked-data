import { useState } from 'react';

export const useModalControls = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    !isModalOpen && setIsModalOpen(true);
  };

  return { isModalOpen, setIsModalOpen, openModal };
};
