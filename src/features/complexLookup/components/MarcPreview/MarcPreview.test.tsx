import { render, screen, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { setInitialGlobalState } from '@/test/__mocks__/store';
import { useMarcPreviewStore, useUIStore } from '@/store';
import { MarcPreview } from './MarcPreview';

jest.mock('@/components/MarcContent', () => ({
  MarcContent: () => <div data-testid="marc-content">Marc Content</div>,
}));

jest.mock('@/features/search/ui', () => ({
  ControlPane: ({
    label,
    subLabel,
    children,
    renderCloseButton,
  }: {
    label: string;
    subLabel: React.ReactNode;
    children: React.ReactNode;
    renderCloseButton: () => React.ReactNode;
  }) => (
    <div data-testid="control-pane">
      <div data-testid="label">{label}</div>
      <div data-testid="sub-label">{subLabel}</div>
      {renderCloseButton()}
      {children}
    </div>
  ),
}));

const marcPreviewData = {
  metadata: {
    updatedDate: '2024-01-01',
  },
} as MarcDTO;

const marcPreviewMetadata = {
  title: 'Test Authority Title',
  headingType: 'Personal Name',
  baseId: 'test-base-id-123',
} as MarcPreviewMetadata;

describe('MarcPreview', () => {
  const mockOnClose = jest.fn();
  const mockOnAssign = jest.fn();
  const mockCheckFailedId = jest.fn();

  const renderComponent = (
    isMarcPreviewOpen: boolean,
    marcData: MarcDTO | null,
    metadata: MarcPreviewMetadata | null,
    props: Partial<React.ComponentProps<typeof MarcPreview>> = {},
  ) => {
    setInitialGlobalState([
      {
        store: useMarcPreviewStore,
        state: { complexValue: marcData, metadata },
      },
      {
        store: useUIStore,
        state: { isMarcPreviewOpen },
      },
    ]);

    return render(
      <IntlProvider locale="en">
        <MarcPreview onClose={mockOnClose} {...props} />
      </IntlProvider>,
    );
  };

  describe('rendering', () => {
    test('renders component when isMarcPreviewOpen is true and marcPreviewData exists', () => {
      renderComponent(true, marcPreviewData, marcPreviewMetadata);

      expect(screen.getByTestId('control-pane')).toBeInTheDocument();
      expect(screen.getByTestId('label')).toHaveTextContent('Test Authority Title');
      expect(screen.getByText('Marc Content')).toBeInTheDocument();
    });

    test('does not render when isMarcPreviewOpen is false', () => {
      renderComponent(false, marcPreviewData, marcPreviewMetadata);

      expect(screen.queryByTestId('control-pane')).not.toBeInTheDocument();
    });

    test('does not render when marcPreviewData is null', () => {
      renderComponent(true, null, marcPreviewMetadata);

      expect(screen.queryByTestId('control-pane')).not.toBeInTheDocument();
    });

    test('displays metadata information in sub-label', () => {
      renderComponent(true, marcPreviewData, marcPreviewMetadata);

      const subLabel = screen.getByTestId('sub-label');
      expect(subLabel).toHaveTextContent('Personal Name');
      expect(subLabel).toHaveTextContent('ld.lastUpdated');
    });

    test('renders assign button when onAssign prop is provided', () => {
      renderComponent(true, marcPreviewData, marcPreviewMetadata, { onAssign: mockOnAssign });

      expect(screen.getByTestId('marc-preview-assign-button')).toBeInTheDocument();
    });

    test('does not render assign button when onAssign prop is not provided', () => {
      renderComponent(true, marcPreviewData, marcPreviewMetadata);

      expect(screen.queryByTestId('marc-preview-assign-button')).not.toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    test('calls onClose when close button is clicked', () => {
      renderComponent(true, marcPreviewData, marcPreviewMetadata);

      const closeButton = screen.getByTestId('nav-close-button');
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('calls onAssign with correct data when assign button is clicked', () => {
      renderComponent(true, marcPreviewData, marcPreviewMetadata, { onAssign: mockOnAssign });

      const assignButton = screen.getByTestId('marc-preview-assign-button');
      fireEvent.click(assignButton);

      expect(mockOnAssign).toHaveBeenCalledWith({
        id: 'test-base-id-123',
        title: 'Test Authority Title',
        linkedFieldValue: 'Personal Name',
      });
    });

    test('does not call onAssign when baseId is missing', () => {
      const metadataWithoutBaseId = {
        ...marcPreviewMetadata,
        baseId: undefined,
      } as unknown as MarcPreviewMetadata;

      renderComponent(true, marcPreviewData, metadataWithoutBaseId, { onAssign: mockOnAssign });

      const assignButton = screen.getByTestId('marc-preview-assign-button');
      fireEvent.click(assignButton);

      expect(mockOnAssign).not.toHaveBeenCalled();
    });
  });

  describe('assign button state', () => {
    test('disables assign button when checkFailedId returns true', () => {
      mockCheckFailedId.mockReturnValue(true);

      renderComponent(true, marcPreviewData, marcPreviewMetadata, {
        onAssign: mockOnAssign,
        checkFailedId: mockCheckFailedId,
      });

      const assignButton = screen.getByTestId('marc-preview-assign-button');
      expect(assignButton).toBeDisabled();
    });

    test('enables assign button when checkFailedId returns false', () => {
      mockCheckFailedId.mockReturnValue(false);

      renderComponent(true, marcPreviewData, marcPreviewMetadata, {
        onAssign: mockOnAssign,
        checkFailedId: mockCheckFailedId,
      });

      const assignButton = screen.getByTestId('marc-preview-assign-button');
      expect(assignButton).not.toBeDisabled();
    });

    test('enables assign button when checkFailedId is not provided', () => {
      renderComponent(true, marcPreviewData, marcPreviewMetadata, { onAssign: mockOnAssign });

      const assignButton = screen.getByTestId('marc-preview-assign-button');
      expect(assignButton).not.toBeDisabled();
    });
  });
});
