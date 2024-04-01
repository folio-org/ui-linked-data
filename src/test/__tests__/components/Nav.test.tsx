import { Nav } from '@components/Nav';
import { fireEvent, render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),

  useNavigate: () => mockNavigate,
}));

const renderOnPath = (path: string) => render(
  <RecoilRoot>
    <RouterProvider router={createMemoryRouter([{ path, element: <Nav /> }], { initialEntries: [path] })} />
  </RecoilRoot>,
);

describe('Nav', () => {
  const { getByTestId, getByText } = screen;

  test('triggers close button component', () => {
    renderOnPath('/resources/create');

    fireEvent.click(getByTestId('nav-close-button'));

    expect(mockNavigate).toHaveBeenCalled();
  });

  test('has links on non-edit-section routes', () => {
    renderOnPath('/other/route');
    
    expect(getByText('marva.searchResource')).toBeInTheDocument();
  });
});
