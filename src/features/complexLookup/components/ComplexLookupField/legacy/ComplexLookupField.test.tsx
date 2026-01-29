import { fireEvent, render, screen } from '@testing-library/react';

import { MockServicesProvider } from '@/test/__mocks__/providers/ServicesProvider.mock';
import { setInitialGlobalState } from '@/test/__mocks__/store';

import { useInputsStore, useProfileStore } from '@/store';

import { ComplexLookupField } from './ComplexLookupField';

const mockModalComponent = <div data-testid="complex-lookup-modal" />;

jest.mock('@/common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: false }));
jest.mock('@/features/complexLookup/components/ModalComplexLookup', () => ({
  ModalComplexLookup: () => mockModalComponent,
}));

describe('Complex Lookup Field', () => {
  const onChange = jest.fn();
  const uuid = 'test-uuid';
  const entry = {
    uuid,
    layout: {
      isNew: true,
      api: 'authorities',
    },
  } as SchemaEntry;
  const value = [
    { id: 'testId_1', label: 'Value 1' },
    { id: 'testId_2', label: 'Value 2' },
  ];

  const { getByTestId, getAllByTestId, queryByTestId, queryAllByTestId, getByRole } = screen;

  function renderComponent(entry: SchemaEntry = {} as SchemaEntry, value: UserValueContents[] = []) {
    setInitialGlobalState([
      {
        store: useProfileStore,
        state: { schema: {} as Schema },
      },
      {
        store: useInputsStore,
        state: { selectedEntries: [] },
      },
    ]);

    render(
      <MockServicesProvider>
        <ComplexLookupField onChange={onChange} entry={entry} value={value} />
      </MockServicesProvider>,
    );
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
    expect(getByRole('button', { name: 'ld.assignAuthority' })).toBeInTheDocument();
  });

  test('triggers onChange and deletes value', () => {
    renderComponent(entry, value);

    fireEvent.click(getAllByTestId('complex-lookup-selected-delete')[0]);

    expect(onChange).toHaveBeenCalledWith(uuid, []);
    expect(queryAllByTestId('complex-lookup-selected')).toHaveLength(value.length - 1);
  });
});
