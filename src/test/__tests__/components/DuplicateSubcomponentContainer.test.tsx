import { render, screen } from '@testing-library/react';
import { DuplicateSubcomponentContainer } from '@components/DuplicateSubcomponentContainer';
import { IFields } from '@components/Fields';

const mockEntry = {
  uuid: 'testUuid_1',
  clonedBy: ['clonedByUuid_1', 'clonedByUuid_2'],
} as SchemaEntry;
const mockGenerateComponent = ({ uuid }: Partial<IFields>) => (
  <div key={uuid} data-testid={`test-repeatable-subcomponent-${uuid}`}>
    {uuid}
  </div>
);

describe('DuplicateSubcomponentContainer', () => {
  const { getByTestId } = screen;

  test('renders "DuplicateSubcomponentContainer" with generated subcomponents', () => {
    render(<DuplicateSubcomponentContainer entry={mockEntry} generateComponent={mockGenerateComponent} />);

    expect(getByTestId('test-repeatable-subcomponent-testUuid_1')).toBeInTheDocument();
    expect(getByTestId('test-repeatable-subcomponent-clonedByUuid_1')).toBeInTheDocument();
    expect(getByTestId('test-repeatable-subcomponent-clonedByUuid_2')).toBeInTheDocument();
  });
});
