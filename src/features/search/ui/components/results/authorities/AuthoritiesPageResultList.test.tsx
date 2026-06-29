import { render, screen } from '@testing-library/react';

import * as useAuthoritiesPageTableFormatterModule from '@/features/search/ui/hooks/useAuthoritiesPageTableFormatter';

import { AuthoritiesPageResultList } from './AuthoritiesPageResultList';

jest.mock('@/features/search/ui/hooks/useAuthoritiesPageTableFormatter');

jest.mock('@/components/Table', () => ({
  TableFlex: () => <div data-testid="table-flex">Table</div>,
}));

const mockNavigateWithState = jest.fn();

jest.mock('@/common/hooks/useNavigateWithSearchState', () => ({
  useNavigateWithSearchState: () => ({
    navigateWithState: mockNavigateWithState,
  }),
}));

jest.mock('@/common/helpers/navigation.helper', () => ({
  generateEditResourceUrl: (id: string) => `/linked-data/resources/${id}/edit`,
}));

const mockFormatterReturn = {
  formattedData: [],
  listHeader: {},
};

describe('AuthoritiesPageResultList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .spyOn(useAuthoritiesPageTableFormatterModule, 'useAuthoritiesPageTableFormatter')
      .mockReturnValue(mockFormatterReturn);
  });

  it('renders the result list container', () => {
    render(<AuthoritiesPageResultList />);

    expect(screen.getByTestId('authorities-search-result-list')).toBeInTheDocument();
  });

  it('renders the TableFlex component', () => {
    render(<AuthoritiesPageResultList />);

    expect(screen.getByTestId('table-flex')).toBeInTheDocument();
  });

  it('passes onEdit and onImport callbacks to the formatter hook', () => {
    const formatterSpy = jest
      .spyOn(useAuthoritiesPageTableFormatterModule, 'useAuthoritiesPageTableFormatter')
      .mockReturnValue(mockFormatterReturn);

    render(<AuthoritiesPageResultList />);

    expect(formatterSpy).toHaveBeenCalledWith({
      onEdit: expect.any(Function),
      onImport: expect.any(Function),
    });
  });

  it('handleEdit calls navigateWithState with the edit URL', () => {
    let capturedOnEdit: ((id: string) => void) | undefined;

    jest
      .spyOn(useAuthoritiesPageTableFormatterModule, 'useAuthoritiesPageTableFormatter')
      .mockImplementation(({ onEdit }) => {
        capturedOnEdit = onEdit;
        return mockFormatterReturn;
      });

    render(<AuthoritiesPageResultList />);

    capturedOnEdit?.('auth-99');

    expect(mockNavigateWithState).toHaveBeenCalledWith('/linked-data/resources/auth-99/edit');
  });
});
