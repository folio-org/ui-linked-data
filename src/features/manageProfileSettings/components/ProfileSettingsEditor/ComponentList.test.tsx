import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@testing-library/react';

import { ComponentType } from './BaseComponent';
import { ComponentList } from './ComponentList';

describe('ComponentList', () => {
  it('renders unused list', () => {
    render(
      <MemoryRouter>
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
      </MemoryRouter>,
    );

    expect(screen.getByTestId('component-list')).toBeInTheDocument();
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

    expect(screen.getByTestId('component-list')).toBeInTheDocument();
    expect(screen.getByText('selected-title-id')).toBeInTheDocument();
  });
});
