import { BrowserRouter } from 'react-router-dom';

import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';

import { TYPE_URIS } from '@/common/constants/bibframe.constants';

import { HubImportNavPane } from './HubImportNavPane';

const mockNavigate = jest.fn();
const mockSearchResultsUri = '/search?query=test';
const mockUseHubQuery = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('@/common/hooks/useBackToSearchUri', () => ({
  useBackToSearchUri: () => mockSearchResultsUri,
}));

jest.mock('@/common/helpers/record.helper', () => ({
  getRecordTitle: jest.fn((_record: RecordEntry) => 'Test Hub Title'),
}));

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: ({ id }: { id: string }) => id,
  }),
}));

jest.mock('@/features/hubImport/hooks', () => ({
  useHubQuery: (...args: unknown[]) => mockUseHubQuery(...args),
}));

describe('HubImportNavPane', () => {
  const mockRecord = {
    id: 'hub_123',
    resource: {
      [TYPE_URIS.HUB]: {
        id: 'hub_123',
        label: 'Test Hub',
      },
    },
  } as unknown as RecordEntry;

  const renderComponent = (hubData?: RecordEntry) => {
    mockUseHubQuery.mockReturnValue({ data: hubData ?? null });

    return render(
      <BrowserRouter>
        <HubImportNavPane />
      </BrowserRouter>,
    );
  };

  it('Renders nav block with close button', () => {
    renderComponent(mockRecord);

    expect(screen.getByTestId('nav-close-button')).toBeInTheDocument();
  });

  it('Renders heading with record title', () => {
    renderComponent(mockRecord);

    expect(screen.getByText(/ld.importHub.header.title/i)).toBeInTheDocument();
  });

  it('Calls navigate with search results URI on close', () => {
    renderComponent(mockRecord);

    fireEvent.click(screen.getByTestId('nav-close-button'));

    expect(mockNavigate).toHaveBeenCalledWith(mockSearchResultsUri);
  });

  it('Renders without record', () => {
    renderComponent();

    expect(screen.getByTestId('nav-close-button')).toBeInTheDocument();
  });

  it('Has correct aria label for close button', () => {
    renderComponent(mockRecord);

    const closeButton = screen.getByTestId('nav-close-button');
    expect(closeButton).toHaveAttribute('aria-label');
  });

  describe('accessibility', () => {
    test.each([
      ['with record', mockRecord],
      ['without record', undefined],
    ])('has no accessibility violations when %s', async (_description, hubData) => {
      const { container } = renderComponent(hubData);

      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });
  });
});
