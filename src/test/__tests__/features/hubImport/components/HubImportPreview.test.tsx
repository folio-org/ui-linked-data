import { setInitialGlobalState } from '@/test/__mocks__/store';

import { BrowserRouter } from 'react-router-dom';
import * as routerDom from 'react-router-dom';

import { render, screen } from '@testing-library/react';

import { TYPE_URIS } from '@/common/constants/bibframe.constants';

import { HubImportPreview } from '@/features/hubImport/components/HubImportPreview';

import { useInputsStore } from '@/store';

const mockUseHubQuery = jest.fn();

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: ({ id }: { id: string }) => id,
  }),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ hubId: 'hub_123' }),
  useSearchParams: () => [new URLSearchParams('source=loc'), jest.fn()],
}));

jest.mock('@/features/hubImport/hooks', () => ({
  useHubQuery: (params: unknown) => mockUseHubQuery(params),
}));

jest.mock('@/components/Loading', () => ({
  Loading: ({ label }: { label: string }) => <div data-testid="loading-component">{label}</div>,
}));

jest.mock('@/components/Preview', () => ({
  Preview: () => <div data-testid="preview-component">Preview</div>,
}));

describe('HubImportPreview', () => {
  const mockRecord = {
    id: 'hub_123',
    resource: {
      [TYPE_URIS.HUB]: {
        id: 'hub_123',
        label: 'Test Hub',
      },
    },
  } as unknown as RecordEntry;

  const renderComponent = (record?: RecordEntry | null, isLoading = false) => {
    setInitialGlobalState([
      {
        store: useInputsStore,
        state: {
          record: record ?? null,
        },
      },
    ]);

    mockUseHubQuery.mockReturnValue({
      isLoading,
      data: record,
      isError: false,
      error: null,
    });

    render(
      <BrowserRouter>
        <HubImportPreview />
      </BrowserRouter>,
    );
  };

  it('Shows loading indicator when data is being fetched', () => {
    renderComponent(null, true);

    expect(screen.getByTestId('loading-component')).toBeInTheDocument();
    expect(screen.queryByTestId('preview-component')).not.toBeInTheDocument();
  });

  it('Renders preview when record is loaded', () => {
    renderComponent(mockRecord, false);

    expect(screen.getByTestId('preview-component')).toBeInTheDocument();
    expect(screen.queryByTestId('loading-component')).not.toBeInTheDocument();
  });

  it('Calls useHubQuery with hubId and source', () => {
    renderComponent(mockRecord, false);

    expect(mockUseHubQuery).toHaveBeenCalledWith({
      hubId: 'hub_123',
      source: 'loc',
      enabled: true,
    });
  });

  it('Shows loading label with hubId', () => {
    renderComponent(null, true);

    const loadingComponent = screen.getByTestId('loading-component');
    expect(loadingComponent.textContent).toContain('ld.importHub.fetchingById');
  });

  it('Uses default source when source param is missing', () => {
    jest.spyOn(routerDom, 'useSearchParams').mockReturnValue([new URLSearchParams(), jest.fn()]);

    renderComponent(mockRecord, false);

    expect(mockUseHubQuery).toHaveBeenCalledWith({
      hubId: 'hub_123',
      source: 'libraryOfCongress',
      enabled: true,
    });
  });

  it('Disables query when hubId is not present', () => {
    jest.spyOn(routerDom, 'useParams').mockReturnValue({ hubId: undefined });

    renderComponent(null, false);

    expect(mockUseHubQuery).toHaveBeenCalledWith({
      hubId: undefined,
      source: 'loc',
      enabled: false,
    });
  });

  it('Shows loading when record exists but isLoading is true', () => {
    renderComponent(mockRecord, true);

    expect(screen.getByTestId('loading-component')).toBeInTheDocument();
    expect(screen.queryByTestId('preview-component')).not.toBeInTheDocument();
  });
});
