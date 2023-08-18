jest.mock('react-modal', () => ({
  default: ({ children }: { children?: React.ReactNode }) => <div data-testid="modal-component">{children}</div>,
}));
