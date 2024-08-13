import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ComplexLookupField } from '@components/ComplexLookupField';

const mockModalComponent = <div data-testid="complex-lookup-modal" />;

jest.mock('@common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: false }));
jest.mock('@components/ComplexLookupField/ModalComplexLookup', () => ({
  ModalComplexLookup: () => mockModalComponent,
}));

describe('Complex Lookup Field', () => {
  const onChange = jest.fn();
  const uuid = 'test-uuid';
  const entry = {
    uuid,
    layout: {
      isNew: true,
    },
  } as SchemaEntry;
  const value = [
    { id: 'testId_1', label: 'Value 1' },
    { id: 'testId_2', label: 'Value 2' },
  ];

  const { getByTestId, getAllByTestId, queryByTestId, queryAllByTestId, getByRole } = screen;

  function renderComponent(entry: SchemaEntry = {} as SchemaEntry, value: UserValueContents[] = []) {
    render(<ComplexLookupField onChange={onChange} entry={entry} value={value} />);
  }

  test('renders complex lookup field with value', () => {
    renderComponent(entry, value);

    expect(getByTestId('complex-lookup-value')).toBeInTheDocument();
    expect(getAllByTestId('complex-lookup-selected')).toHaveLength(value.length);
    const complexLookupSelectedLabels = getAllByTestId('complex-lookup-selected-label');
    expect(complexLookupSelectedLabels).toHaveLength(value.length);
    expect(complexLookupSelectedLabels[0]).toHaveTextContent('Value 1');
    expect(complexLookupSelectedLabels[1]).toHaveTextContent('Value 2');
  });

  test('renders complex lookup field without value', () => {
    renderComponent(entry);

    expect(queryByTestId('complex-lookup-value')).not.toBeInTheDocument();
    expect(getByRole('button', { name: 'marva.assignAuthority' })).toBeInTheDocument();
  });

  test('triggers onChange and adds new value', async () => {
    const event = {
      target: {
        value: 'testValue',
      },
    };

    renderComponent();
    fireEvent.change(getByTestId('complex-lookup-input'), event);

    expect(onChange).toHaveBeenCalledWith(uuid, [
      { label: event.target.value, meta: { uri: '__MOCK_URI_CHANGE_WHEN_IMPLEMENTING' } },
    ]);

    await waitFor(() => expect(getByTestId('complex-lookup-input')).toHaveValue('testValue'));
  });

  test('triggers onChange and deletes value', () => {
    renderComponent(entry, value);

    fireEvent.click(getAllByTestId('complex-lookup-selected-delete')[0]);

    expect(onChange).toHaveBeenCalledWith(uuid, []);
    expect(queryAllByTestId('complex-lookup-selected')).toHaveLength(value.length - 1);
  });
});
