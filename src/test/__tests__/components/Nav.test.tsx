import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { fireEvent, render, screen } from '@testing-library/react';

import { Nav } from '@/components/Nav';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),

  useNavigate: () => mockNavigate,
}));

jest.mock('@/common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: false }));

const renderOnPath = (path: string) =>
  render(<RouterProvider router={createMemoryRouter([{ path, element: <Nav /> }], { initialEntries: [path] })} />);

describe('Nav', () => {
  const { getByTestId } = screen;

  test('triggers close button component', () => {
    renderOnPath('/resources/create');

    fireEvent.click(getByTestId('nav-close-button'));

    expect(mockNavigate).toHaveBeenCalled();
  });
});
