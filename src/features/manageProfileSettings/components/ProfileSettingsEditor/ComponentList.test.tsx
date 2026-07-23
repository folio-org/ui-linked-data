import { MemoryRouter } from 'react-router-dom';

import { DndContext } from '@dnd-kit/core';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';

import { ComponentType } from './BaseComponent';
import { ComponentList } from './ComponentList';

describe('ComponentList', () => {
  it('renders unused list', () => {
    render(
      <MemoryRouter>
        <DndContext>
          <ComponentList
            type={ComponentType.unused}
            components={[]}
            titleId="unused-title-id"
            descriptionId="unused-description-id"
            droppable={true}
            containerId="unused"
          >
            <div>children</div>
          </ComponentList>
        </DndContext>
      </MemoryRouter>,
    );

    expect(screen.getByTestId('unused-component-list')).toBeInTheDocument();
    expect(screen.getByText('unused-title-id')).toBeInTheDocument();
  });

  it('renders selected list', () => {
    render(
      <MemoryRouter>
        <ComponentList
          type={ComponentType.selected}
          components={[]}
          titleId="selected-title-id"
          descriptionId="selected-description-id"
          droppable={false}
          containerId="selected"
        >
          <div>children</div>
        </ComponentList>
      </MemoryRouter>,
    );

    expect(screen.getByTestId('selected-component-list')).toBeInTheDocument();
    expect(screen.getByText('selected-title-id')).toBeInTheDocument();
  });

  describe('accessibility', () => {
    test.each([
      [
        'unused list',
        <MemoryRouter>
          <DndContext>
            <ComponentList
              type={ComponentType.unused}
              components={[]}
              titleId="unused-title-id"
              descriptionId="unused-description-id"
              droppable={true}
              containerId="unused"
            >
              <div>children</div>
            </ComponentList>
          </DndContext>
        </MemoryRouter>,
      ],
      [
        'selected list',
        <MemoryRouter>
          <ComponentList
            type={ComponentType.selected}
            components={[]}
            titleId="selected-title-id"
            descriptionId="selected-description-id"
            droppable={false}
            containerId="selected"
          >
            <div>children</div>
          </ComponentList>
        </MemoryRouter>,
      ],
    ])('has no accessibility violations when rendering %s', async (_description, node) => {
      const { container } = render(node);

      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });
  });
});
