import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@testing-library/react';

import { DraggingComponent } from './DraggingComponent';
import { SelectedComponent } from './SelectedComponent';
import { UnusedComponent } from './UnusedComponent';

describe('BaseComponent', () => {
  const name = 'test-name';
  const mockComponent = {
    id: 'test:component',
    name,
  };

  it('renders UnusedComponent', () => {
    render(
      <MemoryRouter>
        <UnusedComponent component={mockComponent} />
      </MemoryRouter>,
    );

    expect(screen.getByText(name)).toBeInTheDocument();
  });

  it('renders SelectedComponent with both nudge buttons', () => {
    render(
      <MemoryRouter>
        <SelectedComponent component={mockComponent} size={3} index={2} />
      </MemoryRouter>,
    );

    expect(screen.getByText('2. ' + name)).toBeInTheDocument();
    expect(screen.getByTestId('nudge-up')).toBeInTheDocument();
    expect(screen.getByTestId('nudge-down')).toBeInTheDocument();
  });

  it('renders SelectedComponent with only nudge down button', () => {
    render(
      <MemoryRouter>
        <SelectedComponent component={mockComponent} size={3} index={1} />
      </MemoryRouter>,
    );

    expect(screen.getByText('1. ' + name)).toBeInTheDocument();
    expect(screen.queryByTestId('nudge-up')).not.toBeInTheDocument();
    expect(screen.getByTestId('nudge-down')).toBeInTheDocument();
  });

  it('renders SelectedComponent with only nudge up button', () => {
    render(
      <MemoryRouter>
        <SelectedComponent component={mockComponent} size={3} index={3} />
      </MemoryRouter>,
    );

    expect(screen.getByText('3. ' + name)).toBeInTheDocument();
    expect(screen.getByTestId('nudge-up')).toBeInTheDocument();
    expect(screen.queryByTestId('nudge-down')).not.toBeInTheDocument();
  });

  it('renders DraggingComponent', () => {
    render(
      <MemoryRouter>
        <DraggingComponent component={mockComponent} />
      </MemoryRouter>,
    );

    expect(screen.getByText(name)).toBeInTheDocument();
  });
});
