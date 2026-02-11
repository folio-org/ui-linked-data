import { BrowserRouter } from 'react-router-dom';
import * as routerDom from 'react-router-dom';

import { fireEvent, render, screen } from '@testing-library/react';

import { HubImportControls } from './HubImportControls';

const mockNavigate = jest.fn();
const mockImportHubForEdit = jest.fn();
const mockSearchResultsUri = '/search?query=test';

jest.mock('react-intl', () => ({
  FormattedMessage: ({ id }: { id: string }) => <span>{id}</span>,
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ hubId: 'hub_123' }),
  useSearchParams: () => [new URLSearchParams('source=loc'), jest.fn()],
}));

jest.mock('@/common/hooks/useBackToSearchUri', () => ({
  useBackToSearchUri: () => mockSearchResultsUri,
}));

jest.mock('@/features/hubImport/hooks', () => ({
  useHubImportMutation: () => ({
    importHubForEdit: mockImportHubForEdit,
  }),
}));

describe('HubImportControls', () => {
  const renderComponent = () => {
    render(
      <BrowserRouter>
        <HubImportControls />
      </BrowserRouter>,
    );
  };

  it('Renders cancel and continue buttons', () => {
    renderComponent();

    expect(screen.getByTestId('cancel-hub-import-button')).toBeInTheDocument();
    expect(screen.getByTestId('continue-hub-import-button')).toBeInTheDocument();
  });

  it('Calls navigate with search results URI on cancel', () => {
    renderComponent();

    fireEvent.click(screen.getByTestId('cancel-hub-import-button'));

    expect(mockNavigate).toHaveBeenCalledWith(mockSearchResultsUri);
  });

  it('Calls importHubForEdit with hubId and source on continue', () => {
    renderComponent();

    fireEvent.click(screen.getByTestId('continue-hub-import-button'));

    expect(mockImportHubForEdit).toHaveBeenCalledWith('hub_123', 'loc');
  });

  it('Does not call importHubForEdit when hubId is missing', () => {
    jest.spyOn(routerDom, 'useParams').mockReturnValue({ hubId: undefined });

    renderComponent();

    fireEvent.click(screen.getByTestId('continue-hub-import-button'));

    expect(mockImportHubForEdit).not.toHaveBeenCalled();
  });

  it('Uses default source when source param is missing', () => {
    jest.spyOn(routerDom, 'useSearchParams').mockReturnValue([new URLSearchParams(), jest.fn()]);

    renderComponent();

    fireEvent.click(screen.getByTestId('continue-hub-import-button'));

    expect(mockImportHubForEdit).toHaveBeenCalledWith('hub_123', 'libraryOfCongress');
  });
});
