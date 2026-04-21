import { fireEvent, render, screen } from '@testing-library/react';

import { SOURCE_TYPES } from '@/common/constants/lookup.constants';

import { HubPreviewData, HubPreviewMeta, HubResourceData } from '@/features/complexLookup/types/hubPreview.types';

import { HubPreview } from './HubPreview';

jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
  FormattedMessage: ({ id, values }: { id: string; values?: Record<string, unknown> }) => (
    <span>
      {id}
      {values && JSON.stringify(values)}
    </span>
  ),
  useIntl: () => ({
    formatMessage: ({ id }: { id: string }) => id,
  }),
}));

jest.mock('@/features/search/ui', () => ({
  ControlPane: ({
    label,
    renderCloseButton,
    children,
  }: {
    label: string;
    renderCloseButton: () => React.ReactNode;
    children?: React.ReactNode;
  }) => (
    <div data-testid="control-pane">
      <div data-testid="control-pane-label">{label}</div>
      {renderCloseButton()}
      {children}
    </div>
  ),
}));

jest.mock('@/components/Preview', () => ({
  Preview: ({
    altSchema,
    altUserValues,
    altInitKey,
  }: {
    altSchema: unknown;
    altUserValues: Record<string, unknown>;
    altInitKey: string;
  }) => (
    <div data-testid="preview">
      <div data-testid="preview-schema">
        {altSchema instanceof Map ? `Map(${altSchema.size})` : JSON.stringify(altSchema)}
      </div>
      <div data-testid="preview-user-values">{JSON.stringify(altUserValues)}</div>
      <div data-testid="preview-init-key">{altInitKey}</div>
    </div>
  ),
}));

describe('HubPreview', () => {
  const mockOnClose = jest.fn();
  const mockOnAssign = jest.fn();

  const mockPreviewData: HubPreviewData = {
    id: 'hub_1',
    resource: {
      base: new Map(),
      userValues: {},
      initKey: 'init_key_1',
    },
  };

  const mockPreviewMeta: HubPreviewMeta = {
    id: 'hub_1',
    title: 'Hub Title 1',
  };

  describe('Rendering', () => {
    test('renders control pane with title from meta', () => {
      render(
        <HubPreview
          onClose={mockOnClose}
          previewData={mockPreviewData}
          previewMeta={mockPreviewMeta}
          onAssign={mockOnAssign}
        />,
      );

      expect(screen.getByTestId('control-pane-label')).toHaveTextContent('Hub Title 1');
    });

    test('renders empty title when meta is null', () => {
      render(<HubPreview onClose={mockOnClose} previewData={mockPreviewData} previewMeta={null} />);

      expect(screen.getByTestId('control-pane-label')).toHaveTextContent('');
    });

    test('renders close button', () => {
      render(
        <HubPreview
          onClose={mockOnClose}
          previewData={mockPreviewData}
          previewMeta={mockPreviewMeta}
          onAssign={mockOnAssign}
        />,
      );

      expect(screen.getByTestId('hub-preview-close-button')).toBeInTheDocument();
    });

    test('renders assign button when onAssign is provided and has preview resource', () => {
      render(
        <HubPreview
          onClose={mockOnClose}
          previewData={mockPreviewData}
          previewMeta={mockPreviewMeta}
          onAssign={mockOnAssign}
        />,
      );

      expect(screen.getByTestId('hub-preview-assign-button')).toBeInTheDocument();
    });

    test('does not render assign button when onAssign is not provided', () => {
      render(<HubPreview onClose={mockOnClose} previewData={mockPreviewData} previewMeta={mockPreviewMeta} />);

      expect(screen.queryByTestId('hub-preview-assign-button')).not.toBeInTheDocument();
    });

    test('Does not render assign button when preview resource is empty object', () => {
      const emptyPreviewData = {
        id: 'hub_2',
        resource: {} as HubResourceData,
      };

      render(
        <HubPreview
          onClose={mockOnClose}
          previewData={emptyPreviewData}
          previewMeta={mockPreviewMeta}
          onAssign={mockOnAssign}
        />,
      );

      expect(screen.queryByTestId('hub-preview-assign-button')).not.toBeInTheDocument();
    });

    test('renders preview component with correct data', () => {
      render(
        <HubPreview
          onClose={mockOnClose}
          previewData={mockPreviewData}
          previewMeta={mockPreviewMeta}
          onAssign={mockOnAssign}
        />,
      );

      expect(screen.getByTestId('preview')).toBeInTheDocument();
      expect(screen.getByTestId('preview-schema')).toHaveTextContent('Map(0)');
      expect(screen.getByTestId('preview-user-values')).toHaveTextContent(
        JSON.stringify(mockPreviewData.resource.userValues),
      );
      expect(screen.getByTestId('preview-init-key')).toHaveTextContent(mockPreviewData.resource.initKey);
    });

    test('renders empty resource message when resource is empty object', () => {
      const emptyPreviewData = {
        id: 'hub_3',
        resource: {} as HubResourceData,
      };

      render(<HubPreview onClose={mockOnClose} previewData={emptyPreviewData} previewMeta={mockPreviewMeta} />);

      expect(screen.queryByTestId('preview')).not.toBeInTheDocument();
      expect(screen.getByText(/resourceWithIdIsEmpty/i)).toBeInTheDocument();
    });

    test('renders preview when data has valid resource structure', () => {
      const validResourceData: HubPreviewData = {
        id: 'hub_4',
        resource: {
          base: new Map(),
          userValues: {},
          initKey: 'key_1',
        },
      };

      render(<HubPreview onClose={mockOnClose} previewData={validResourceData} previewMeta={mockPreviewMeta} />);

      expect(screen.getByTestId('preview')).toBeInTheDocument();
    });
  });

  describe('User interactions', () => {
    test('calls onClose when close button is clicked', () => {
      render(
        <HubPreview
          onClose={mockOnClose}
          previewData={mockPreviewData}
          previewMeta={mockPreviewMeta}
          onAssign={mockOnAssign}
        />,
      );

      fireEvent.click(screen.getByTestId('hub-preview-close-button'));

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('calls onAssign with correct parameters when assign button is clicked', () => {
      render(
        <HubPreview
          onClose={mockOnClose}
          previewData={mockPreviewData}
          previewMeta={mockPreviewMeta}
          onAssign={mockOnAssign}
        />,
      );

      fireEvent.click(screen.getByTestId('hub-preview-assign-button'));

      expect(mockOnAssign).toHaveBeenCalledWith({
        id: 'hub_1',
        title: 'Hub Title 1',
        sourceType: SOURCE_TYPES.LOCAL,
      });
    });

    test('does not call onAssign when preview meta is null', () => {
      render(
        <HubPreview onClose={mockOnClose} previewData={mockPreviewData} previewMeta={null} onAssign={mockOnAssign} />,
      );

      const assignButton = screen.queryByTestId('hub-preview-assign-button');
      if (assignButton) {
        fireEvent.click(assignButton);
      }

      expect(mockOnAssign).not.toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    test('handles null preview data', () => {
      render(<HubPreview onClose={mockOnClose} previewData={null} previewMeta={mockPreviewMeta} />);

      expect(screen.queryByTestId('preview')).not.toBeInTheDocument();
      expect(screen.queryByText(/resourceWithIdIsEmpty/i)).not.toBeInTheDocument();
    });

    test('handles preview data with partial resource', () => {
      const partialData: HubPreviewData = {
        id: 'hub_5',
        resource: {
          base: new Map(),
          userValues: {},
          initKey: '',
        },
      };

      render(<HubPreview onClose={mockOnClose} previewData={partialData} previewMeta={mockPreviewMeta} />);

      expect(screen.getByTestId('preview')).toBeInTheDocument();
    });
  });
});
