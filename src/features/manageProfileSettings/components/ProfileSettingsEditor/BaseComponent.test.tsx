import { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';

import { DndContext } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { DraggingComponent } from './DraggingComponent';
import { SelectedComponent } from './SelectedComponent';
import { UnusedComponent } from './UnusedComponent';

describe('BaseComponent', () => {
  const name = 'test-name';
  const makeComponent = (mandatory: boolean) => {
    return {
      id: 'test:component',
      name,
      mandatory,
    };
  };

  const renderComponent = (node: ReactNode, component: ProfileSettingComponent) => {
    return render(
      <MemoryRouter>
        <DndContext>
          <SortableContext items={[component]}>{node}</SortableContext>
        </DndContext>
      </MemoryRouter>,
    );
  };

  it('renders UnusedComponent', () => {
    const mockComponent = makeComponent(false);
    renderComponent(<UnusedComponent component={mockComponent} />, mockComponent);

    expect(screen.getByText(name)).toBeInTheDocument();
  });

  it('renders SelectedComponent with both nudge buttons', () => {
    const mockComponent = makeComponent(false);
    renderComponent(<SelectedComponent component={mockComponent} size={3} index={2} />, mockComponent);

    expect(screen.getByText('2. ' + name)).toBeInTheDocument();
    expect(screen.getByTestId('nudge-up')).toBeInTheDocument();
    expect(screen.getByTestId('nudge-down')).toBeInTheDocument();
  });

  it('renders SelectedComponent at top of list with only nudge down button', () => {
    const mockComponent = makeComponent(false);
    renderComponent(<SelectedComponent component={mockComponent} size={3} index={1} />, mockComponent);

    expect(screen.getByText('1. ' + name)).toBeInTheDocument();
    expect(screen.queryByTestId('nudge-up')).not.toBeInTheDocument();
    expect(screen.getByTestId('nudge-down')).toBeInTheDocument();
  });

  it('renders SelectedComponent at bottom of list with only nudge up button', () => {
    const mockComponent = makeComponent(false);
    renderComponent(<SelectedComponent component={mockComponent} size={3} index={3} />, mockComponent);

    expect(screen.getByText('3. ' + name)).toBeInTheDocument();
    expect(screen.getByTestId('nudge-up')).toBeInTheDocument();
    expect(screen.queryByTestId('nudge-down')).not.toBeInTheDocument();
  });

  it('renders mandatory SelectedComponent with appropriate text', () => {
    const mockComponent = makeComponent(true);
    renderComponent(<SelectedComponent component={mockComponent} size={1} index={1} />, mockComponent);

    expect(screen.getByText('ld.requiredAnnotation')).toBeInTheDocument();
  });

  it('renders DraggingComponent', () => {
    const mockComponent = makeComponent(false);
    renderComponent(<DraggingComponent component={mockComponent} />, mockComponent);

    expect(screen.getByText(name)).toBeInTheDocument();
  });

  it('renders a SelectedComponent with a context menu when the button is clicked', () => {
    const mockComponent = makeComponent(false);
    renderComponent(<SelectedComponent component={mockComponent} size={1} index={1} />, mockComponent);

    expect(screen.getByTestId('activate-menu')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('activate-menu'));

    waitFor(() => {
      expect(screen.getByTestId('move-menu')).toBeInTheDocument();
    });
  });

  it('renders a mandatory SelectedComponent with a context menu with a warning when the button is clicked', () => {
    const mockComponent = makeComponent(true);
    renderComponent(<SelectedComponent component={mockComponent} size={1} index={1} />, mockComponent);

    expect(screen.getByTestId('activate-menu')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('activate-menu'));

    waitFor(() => {
      expect(screen.queryByTestId('move-action')).not.toBeInTheDocument();
    });
  });

  it('renders an UnusedComponent with a context menu when the button is clicked', () => {
    const mockComponent = makeComponent(false);
    renderComponent(<UnusedComponent component={mockComponent} />, mockComponent);

    expect(screen.getByTestId('activate-menu')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('activate-menu'));

    waitFor(() => {
      expect(screen.getByTestId('move-menu')).toBeInTheDocument();
    });
  });

  it('toggle off a context menu', () => {
    const mockComponent = makeComponent(false);
    renderComponent(<UnusedComponent component={mockComponent} />, mockComponent);

    fireEvent.click(screen.getByTestId('activate-menu'));

    waitFor(() => {
      expect(screen.getByTestId('move-menu')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('activate-menu'));

    waitFor(() => {
      expect(screen.queryByTestId('move-menu')).not.toBeInTheDocument();
    });
  });

  it('dismiss a context menu by clicking elsewhere', () => {
    const mockComponent = makeComponent(false);
    renderComponent(<UnusedComponent component={mockComponent} />, mockComponent);

    fireEvent.click(screen.getByTestId('activate-menu'));

    waitFor(() => {
      expect(screen.getByTestId('move-menu')).toBeInTheDocument();
    });

    fireEvent.mouseDown(document);

    waitFor(() => {
      expect(screen.queryByTestId('move-menu')).not.toBeInTheDocument();
    });
  });

  it('dismiss a context menu by typing escape', () => {
    const mockComponent = makeComponent(false);
    renderComponent(<UnusedComponent component={mockComponent} />, mockComponent);

    fireEvent.click(screen.getByTestId('activate-menu'));

    waitFor(() => {
      expect(screen.getByTestId('move-menu')).toBeInTheDocument();
    });

    fireEvent.keyDown(document, { key: 'Escape' });

    waitFor(() => {
      expect(screen.queryByTestId('move-menu')).not.toBeInTheDocument();
    });
  });

  it('dismiss a context menu by changing focus', () => {
    const mockComponent = makeComponent(false);
    renderComponent(<SelectedComponent component={mockComponent} size={2} index={1} />, mockComponent);

    screen.getByTestId('activate-menu').focus();
    fireEvent.click(screen.getByTestId('activate-menu'));

    waitFor(() => {
      expect(screen.getByTestId('move-menu')).toBeInTheDocument();
    });

    expect(screen.getByTestId('nudge-down')).toBeInTheDocument();
    screen.getByTestId('nudge-down').focus();

    waitFor(() => {
      expect(screen.queryByTestId('move-menu')).not.toBeInTheDocument();
    });
  });
});
