export const setIsModalOpen = jest.fn();
export const openModal = jest.fn();

jest.mock('@/common/hooks/useModalControls', () => ({
  useModalControls: () => ({
    isModalOpen: false,
    setIsModalOpen,
    openModal,
  }),
}));
