jest.mock('@components/Modal', () => ({
  Modal: () => <div data-testid="modal-component" />,
}));
