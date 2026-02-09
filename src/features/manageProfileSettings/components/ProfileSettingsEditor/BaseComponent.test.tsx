import { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';

import { DndContext } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
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

  const renderComponent = (node: ReactNode) => {
    return render(
      <MemoryRouter>
        <DndContext>
          <SortableContext items={[mockComponent]}>{node}</SortableContext>
        </DndContext>
      </MemoryRouter>,
    );
  };

  it('renders UnusedComponent', () => {
    renderComponent(<UnusedComponent component={mockComponent} />);

    expect(screen.getByText(name)).toBeInTheDocument();
  });

  it('renders SelectedComponent with both nudge buttons', () => {
    renderComponent(<SelectedComponent component={mockComponent} size={3} index={2} />);

    expect(screen.getByText('2. ' + name)).toBeInTheDocument();
    expect(screen.getByTestId('nudge-up')).toBeInTheDocument();
    expect(screen.getByTestId('nudge-down')).toBeInTheDocument();
  });

  it('renders SelectedComponent with only nudge down button', () => {
    renderComponent(<SelectedComponent component={mockComponent} size={3} index={1} />);

    expect(screen.getByText('1. ' + name)).toBeInTheDocument();
    expect(screen.queryByTestId('nudge-up')).not.toBeInTheDocument();
    expect(screen.getByTestId('nudge-down')).toBeInTheDocument();
  });

  it('renders SelectedComponent with only nudge up button', () => {
    render(<SelectedComponent component={mockComponent} size={3} index={3} />);

    expect(screen.getByText('3. ' + name)).toBeInTheDocument();
    expect(screen.getByTestId('nudge-up')).toBeInTheDocument();
    expect(screen.queryByTestId('nudge-down')).not.toBeInTheDocument();
  });

  it('renders DraggingComponent', () => {
    renderComponent(<DraggingComponent component={mockComponent} />);

    expect(screen.getByText(name)).toBeInTheDocument();
  });
});
