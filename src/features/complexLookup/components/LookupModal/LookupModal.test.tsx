import { render, screen } from '@testing-library/react';

import { LookupModal } from './LookupModal';

jest.mock('@/components/Modal', () => ({
  Modal: ({
    isOpen,
    children,
    title,
    onClose,
  }: {
    isOpen: boolean;
    children: React.ReactNode;
    title: React.ReactNode;
    onClose: () => void;
  }) =>
    isOpen ? (
      <div data-testid="modal">
        <div data-testid="modal-title">{title}</div>
        <button onClick={onClose} data-testid="modal-close">
          Close
        </button>
        <div data-testid="modal-content">{children}</div>
      </div>
    ) : null,
}));

describe('LookupModal', () => {
  const mockOnClose = jest.fn();

  describe('Modal visibility', () => {
    it('renders modal when isOpen is true', () => {
      render(
        <LookupModal isOpen={true} onClose={mockOnClose} title="Test Title">
          <div>Test Content</div>
        </LookupModal>,
      );

      expect(screen.getByTestId('modal')).toBeInTheDocument();
      expect(screen.getByTestId('modal-title')).toHaveTextContent('Test Title');
    });

    it('does not render modal when isOpen is false', () => {
      render(
        <LookupModal isOpen={false} onClose={mockOnClose} title="Test Title">
          <div>Test Content</div>
        </LookupModal>,
      );

      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });
  });

  describe('Content rendering', () => {
    it('renders children inside complex-lookup-search-contents wrapper', () => {
      render(
        <LookupModal isOpen={true} onClose={mockOnClose} title="Test Title">
          <div data-testid="test-child">Test Content</div>
        </LookupModal>,
      );

      const wrapper = screen.getByTestId('complex-lookup-search-contents');
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toContainElement(screen.getByTestId('test-child'));
    });

    it('renders ReactElement as title', () => {
      const title = <span data-testid="custom-title">Custom Title</span>;

      render(
        <LookupModal isOpen={true} onClose={mockOnClose} title={title}>
          <div>Test Content</div>
        </LookupModal>,
      );

      expect(screen.getByTestId('custom-title')).toBeInTheDocument();
      expect(screen.getByTestId('custom-title')).toHaveTextContent('Custom Title');
    });

    it('renders string as title', () => {
      render(
        <LookupModal isOpen={true} onClose={mockOnClose} title="String Title">
          <div>Test Content</div>
        </LookupModal>,
      );

      expect(screen.getByTestId('modal-title')).toHaveTextContent('String Title');
    });
  });

  describe('Modal controls', () => {
    it('calls onClose when modal close button is clicked', () => {
      render(
        <LookupModal isOpen={true} onClose={mockOnClose} title="Test Title">
          <div>Test Content</div>
        </LookupModal>,
      );

      screen.getByTestId('modal-close').click();

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });
});
