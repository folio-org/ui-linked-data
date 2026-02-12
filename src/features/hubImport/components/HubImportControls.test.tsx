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
  useSearchParams: () => [
    new URLSearchParams('sourceUri=http%3A%2F%2Fid.loc.gov%2Fresources%2Fhubs%2Fhub_123'),
    jest.fn(),
  ],
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

  it('Calls importHubForEdit with sourceUri on continue', () => {
    renderComponent();

    fireEvent.click(screen.getByTestId('continue-hub-import-button'));

    expect(mockImportHubForEdit).toHaveBeenCalledWith('http://id.loc.gov/resources/hubs/hub_123');
  });

  it('Does not call importHubForEdit when sourceUri is missing', () => {
    jest.spyOn(routerDom, 'useSearchParams').mockReturnValue([new URLSearchParams(), jest.fn()]);

    renderComponent();

    fireEvent.click(screen.getByTestId('continue-hub-import-button'));

    expect(mockImportHubForEdit).not.toHaveBeenCalled();
  });
});
