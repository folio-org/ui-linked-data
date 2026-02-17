import { render, screen } from '@testing-library/react';

import { AuthoritiesContent } from './AuthoritiesContent';

jest.mock('@/components/Loading', () => ({
  Loading: () => <div data-testid="loading">Loading...</div>,
}));

jest.mock('@/features/search/ui/components/Search', () => {
  const MockSearch = Object.assign(
    ({ children }: { children: React.ReactNode }) => <div data-testid="search">{children}</div>,
    {
      ControlPane: ({ label }: { label: React.ReactNode }) => <div data-testid="control-pane">{label}</div>,
      ContentContainer: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="content-container">{children}</div>
      ),
      Results: Object.assign(({ children }: { children: React.ReactNode }) => <div>{children}</div>, {
        Pagination: () => <div data-testid="pagination" />,
      }),
    },
  );

  return { Search: MockSearch };
});

jest.mock('@/features/search/ui', () => ({
  AuthoritiesResultList: ({
    context,
    onAssign,
    onTitleClick,
    checkFailedId,
  }: {
    context: string;
    onAssign: (record: ComplexLookupAssignRecordDTO) => void;
    onTitleClick: (id: string) => void;
    checkFailedId?: (id?: string) => boolean;
  }) => (
    <div data-testid="authorities-result-list">
      <span>{context}</span>
      <button onClick={() => onAssign({ id: 'auth_1', title: 'Authority 1' })}>Assign Authority</button>
      <button onClick={() => onTitleClick('auth_1')}>View MARC</button>
      {checkFailedId && <span data-testid="has-check-failed-id">has checkFailedId</span>}
    </div>
  ),
}));

jest.mock('@/features/complexLookup/components/MarcPreview', () => ({
  MarcPreview: ({
    onClose,
    onAssign,
    checkFailedId,
  }: {
    onClose: () => void;
    onAssign?: (record: ComplexLookupAssignRecordDTO) => void;
    checkFailedId?: (id?: string) => boolean;
  }) => (
    <div data-testid="marc-preview">
      <button onClick={onClose} data-testid="marc-preview-close">
        Close Preview
      </button>
      {onAssign && (
        <button onClick={() => onAssign({ id: 'auth_2', title: 'Authority 2' })} data-testid="marc-preview-assign">
          Assign from Preview
        </button>
      )}
      {checkFailedId && <span data-testid="marc-has-check-failed-id">has checkFailedId</span>}
    </div>
  ),
}));

describe('AuthoritiesContent', () => {
  const mockHandleAuthoritiesAssign = jest.fn();
  const mockHandleTitleClick = jest.fn();
  const mockHandleCloseMarcPreview = jest.fn();
  const mockCheckFailedId = jest.fn();

  describe('Authorities result list view', () => {
    it('renders control pane with MARC authority label when MARC preview is closed', () => {
      render(
        <AuthoritiesContent
          isMarcPreviewOpen={false}
          isMarcLoading={false}
          handleAuthoritiesAssign={mockHandleAuthoritiesAssign}
          handleTitleClick={mockHandleTitleClick}
          handleCloseMarcPreview={mockHandleCloseMarcPreview}
        />,
      );

      const controlPane = screen.getByTestId('control-pane');
      expect(controlPane).toBeInTheDocument();
      expect(controlPane).toHaveTextContent('ld.marcAuthority');
    });

    it('renders content container when MARC preview is closed', () => {
      render(
        <AuthoritiesContent
          isMarcPreviewOpen={false}
          isMarcLoading={false}
          handleAuthoritiesAssign={mockHandleAuthoritiesAssign}
          handleTitleClick={mockHandleTitleClick}
          handleCloseMarcPreview={mockHandleCloseMarcPreview}
        />,
      );

      expect(screen.getByTestId('content-container')).toBeInTheDocument();
    });

    it('renders AuthoritiesResultList with complexLookup context', () => {
      render(
        <AuthoritiesContent
          isMarcPreviewOpen={false}
          isMarcLoading={false}
          handleAuthoritiesAssign={mockHandleAuthoritiesAssign}
          handleTitleClick={mockHandleTitleClick}
          handleCloseMarcPreview={mockHandleCloseMarcPreview}
        />,
      );

      const resultList = screen.getByTestId('authorities-result-list');
      expect(resultList).toBeInTheDocument();
      expect(resultList).toHaveTextContent('complexLookup');
    });

    it('renders pagination when MARC preview is closed', () => {
      render(
        <AuthoritiesContent
          isMarcPreviewOpen={false}
          isMarcLoading={false}
          handleAuthoritiesAssign={mockHandleAuthoritiesAssign}
          handleTitleClick={mockHandleTitleClick}
          handleCloseMarcPreview={mockHandleCloseMarcPreview}
        />,
      );

      expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });

    it('passes handleAuthoritiesAssign to AuthoritiesResultList', () => {
      render(
        <AuthoritiesContent
          isMarcPreviewOpen={false}
          isMarcLoading={false}
          handleAuthoritiesAssign={mockHandleAuthoritiesAssign}
          handleTitleClick={mockHandleTitleClick}
          handleCloseMarcPreview={mockHandleCloseMarcPreview}
        />,
      );

      screen.getByText('Assign Authority').click();

      expect(mockHandleAuthoritiesAssign).toHaveBeenCalledWith({ id: 'auth_1', title: 'Authority 1' });
    });

    it('passes handleTitleClick to AuthoritiesResultList', () => {
      render(
        <AuthoritiesContent
          isMarcPreviewOpen={false}
          isMarcLoading={false}
          handleAuthoritiesAssign={mockHandleAuthoritiesAssign}
          handleTitleClick={mockHandleTitleClick}
          handleCloseMarcPreview={mockHandleCloseMarcPreview}
        />,
      );

      screen.getByText('View MARC').click();

      expect(mockHandleTitleClick).toHaveBeenCalledWith('auth_1');
    });

    it('passes checkFailedId to AuthoritiesResultList when provided', () => {
      render(
        <AuthoritiesContent
          isMarcPreviewOpen={false}
          isMarcLoading={false}
          handleAuthoritiesAssign={mockHandleAuthoritiesAssign}
          handleTitleClick={mockHandleTitleClick}
          handleCloseMarcPreview={mockHandleCloseMarcPreview}
          checkFailedId={mockCheckFailedId}
        />,
      );

      expect(screen.getByTestId('has-check-failed-id')).toBeInTheDocument();
    });
  });

  describe('MARC preview view', () => {
    it('shows loading state when MARC preview is open and loading', () => {
      render(
        <AuthoritiesContent
          isMarcPreviewOpen={true}
          isMarcLoading={true}
          handleAuthoritiesAssign={mockHandleAuthoritiesAssign}
          handleTitleClick={mockHandleTitleClick}
          handleCloseMarcPreview={mockHandleCloseMarcPreview}
        />,
      );

      expect(screen.getByTestId('loading')).toBeInTheDocument();
      expect(screen.queryByTestId('marc-preview')).not.toBeInTheDocument();
    });

    it('shows MARC preview when open and not loading', () => {
      render(
        <AuthoritiesContent
          isMarcPreviewOpen={true}
          isMarcLoading={false}
          handleAuthoritiesAssign={mockHandleAuthoritiesAssign}
          handleTitleClick={mockHandleTitleClick}
          handleCloseMarcPreview={mockHandleCloseMarcPreview}
        />,
      );

      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      expect(screen.getByTestId('marc-preview')).toBeInTheDocument();
    });

    it('passes handleCloseMarcPreview to MarcPreview', () => {
      render(
        <AuthoritiesContent
          isMarcPreviewOpen={true}
          isMarcLoading={false}
          handleAuthoritiesAssign={mockHandleAuthoritiesAssign}
          handleTitleClick={mockHandleTitleClick}
          handleCloseMarcPreview={mockHandleCloseMarcPreview}
        />,
      );

      screen.getByTestId('marc-preview-close').click();

      expect(mockHandleCloseMarcPreview).toHaveBeenCalled();
    });

    it('passes handleAuthoritiesAssign to MarcPreview when hasComplexFlow is true', () => {
      render(
        <AuthoritiesContent
          isMarcPreviewOpen={true}
          isMarcLoading={false}
          handleAuthoritiesAssign={mockHandleAuthoritiesAssign}
          handleTitleClick={mockHandleTitleClick}
          handleCloseMarcPreview={mockHandleCloseMarcPreview}
          hasComplexFlow={true}
        />,
      );

      screen.getByTestId('marc-preview-assign').click();

      expect(mockHandleAuthoritiesAssign).toHaveBeenCalledWith({ id: 'auth_2', title: 'Authority 2' });
    });

    it('does not pass handleAuthoritiesAssign to MarcPreview when hasComplexFlow is false', () => {
      render(
        <AuthoritiesContent
          isMarcPreviewOpen={true}
          isMarcLoading={false}
          handleAuthoritiesAssign={mockHandleAuthoritiesAssign}
          handleTitleClick={mockHandleTitleClick}
          handleCloseMarcPreview={mockHandleCloseMarcPreview}
          hasComplexFlow={false}
        />,
      );

      expect(screen.queryByTestId('marc-preview-assign')).not.toBeInTheDocument();
    });

    it('passes checkFailedId to MarcPreview when provided', () => {
      render(
        <AuthoritiesContent
          isMarcPreviewOpen={true}
          isMarcLoading={false}
          handleAuthoritiesAssign={mockHandleAuthoritiesAssign}
          handleTitleClick={mockHandleTitleClick}
          handleCloseMarcPreview={mockHandleCloseMarcPreview}
          checkFailedId={mockCheckFailedId}
        />,
      );

      expect(screen.getByTestId('marc-has-check-failed-id')).toBeInTheDocument();
    });

    it('hides authorities result list when MARC preview is open', () => {
      render(
        <AuthoritiesContent
          isMarcPreviewOpen={true}
          isMarcLoading={false}
          handleAuthoritiesAssign={mockHandleAuthoritiesAssign}
          handleTitleClick={mockHandleTitleClick}
          handleCloseMarcPreview={mockHandleCloseMarcPreview}
        />,
      );

      expect(screen.queryByTestId('authorities-result-list')).not.toBeInTheDocument();
      expect(screen.queryByTestId('control-pane')).not.toBeInTheDocument();
      expect(screen.queryByTestId('content-container')).not.toBeInTheDocument();
    });
  });
});
