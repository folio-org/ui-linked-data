import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@testing-library/react';

import { Footer } from './Footer';

const mockUseRoutePathPattern = jest.fn();
const mockUseResourcePreviewQuery = jest.fn();
const mockUseHubQuery = jest.fn();

jest.mock('@/common/hooks/useRoutePathPattern', () => ({
  useRoutePathPattern: (...args: unknown[]) => mockUseRoutePathPattern(...args),
}));

jest.mock('@/features/resources', () => ({
  useResourcePreviewQuery: (...args: unknown[]) => mockUseResourcePreviewQuery(...args),
}));

jest.mock('@/features/hubImport', () => ({
  useHubQuery: (...args: unknown[]) => mockUseHubQuery(...args),
  HubImportControls: () => <div data-testid="hub-import-controls" />,
}));

jest.mock('@/features/edit', () => ({
  RecordControls: () => <div data-testid="record-controls" />,
}));

jest.mock('@/views/ExternalResource/components/PreviewExternalResourceControls', () => ({
  PreviewExternalResourceControls: () => <div data-testid="external-resource-controls" />,
}));

jest.mock(
  '@/features/manageProfileSettings/components/ManageProfileSettingsControls/ManageProfileSettingsControls',
  () => ({ ManageProfileSettingsControls: () => <div data-testid="manage-profile-controls" /> }),
);

const renderFooter = () =>
  render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>,
  );

// Helper: simulate being on a given route section.
// Footer calls useRoutePathPattern 4 times in order:
// 1 -> showRecordControls, 2 -> showExternalResourceControls,
// 3 -> showHubImportControls, 4 -> showManageProfileSettingsControls
const setActiveRoute = (index: 1 | 2 | 3 | 4) => {
  mockUseRoutePathPattern
    .mockReturnValueOnce(index === 1)
    .mockReturnValueOnce(index === 2)
    .mockReturnValueOnce(index === 3)
    .mockReturnValueOnce(index === 4);
};

describe('Footer', () => {
  beforeEach(() => {
    mockUseResourcePreviewQuery.mockReturnValue({ data: null });
    mockUseHubQuery.mockReturnValue({ data: null });
  });

  describe('external resource route', () => {
    it('does not render footer when query has no data', () => {
      setActiveRoute(2);

      renderFooter();

      expect(screen.queryByTestId('external-resource-controls')).not.toBeInTheDocument();
    });

    it('renders footer when query has data', () => {
      setActiveRoute(2);
      mockUseResourcePreviewQuery.mockReturnValue({ data: { record: {} } });

      renderFooter();

      expect(screen.getByTestId('external-resource-controls')).toBeInTheDocument();
    });
  });

  describe('hub import route', () => {
    it('does not render footer when query has no data', () => {
      setActiveRoute(3);

      renderFooter();

      expect(screen.queryByTestId('hub-import-controls')).not.toBeInTheDocument();
    });

    it('renders footer when query has data', () => {
      setActiveRoute(3);
      mockUseHubQuery.mockReturnValue({ data: { resource: {} } });

      renderFooter();

      expect(screen.getByTestId('hub-import-controls')).toBeInTheDocument();
    });
  });

  describe('edit route', () => {
    it('renders record controls without any query data dependency', () => {
      setActiveRoute(1);

      renderFooter();

      expect(screen.getByTestId('record-controls')).toBeInTheDocument();
    });
  });
});
