import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';

import { IFields } from '../Fields';
import { DuplicateSubcomponentContainer } from './DuplicateSubcomponentContainer';

const mockEntry = {
  uuid: 'testUuid_1',
} as SchemaEntry;
const mockGenerateComponent = ({ uuid }: Partial<IFields>) => (
  <div key={uuid} data-testid={`test-repeatable-subcomponent-${uuid}`}>
    {uuid}
  </div>
);

describe('DuplicateSubcomponentContainer', () => {
  const { getByTestId } = screen;

  test('renders "DuplicateSubcomponentContainer" with generated subcomponents', () => {
    render(
      <DuplicateSubcomponentContainer
        entry={mockEntry}
        twins={['clonedByUuid_1', 'clonedByUuid_2']}
        generateComponent={mockGenerateComponent}
      />,
    );

    expect(getByTestId('test-repeatable-subcomponent-testUuid_1')).toBeInTheDocument();
    expect(getByTestId('test-repeatable-subcomponent-clonedByUuid_1')).toBeInTheDocument();
    expect(getByTestId('test-repeatable-subcomponent-clonedByUuid_2')).toBeInTheDocument();
  });

  describe('accessibility', () => {
    test('has no accessibility violations', async () => {
      const { container } = render(
        <DuplicateSubcomponentContainer
          entry={mockEntry}
          twins={['clonedByUuid_1', 'clonedByUuid_2']}
          generateComponent={mockGenerateComponent}
        />,
      );

      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });
  });
});
