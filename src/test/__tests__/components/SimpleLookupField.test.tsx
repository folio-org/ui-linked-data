import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SimpleLookupField } from '@/components/SimpleLookupField';

jest.mock('@/common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: false }));

const mockOptions = [
  { label: 'value-1', value: { label: 'value-1', uri: 'uri-1' }, __isNew__: false },
  { label: 'value-2', value: { label: 'value-2', uri: 'uri-2' }, __isNew__: false },
  { label: 'value-3', value: { label: 'value-3', uri: 'uri-3' }, __isNew__: false },
];

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
queryClient.setQueryData(['lookup', 'lookupUri'], mockOptions);

describe('Simple lookup field', () => {
  const renderScreen = (isMulti: boolean) => {
    const initialValue = [
      {
        label: 'value-1',
      },
      {
        label: 'value-2',
      },
    ];

    return render(
      <QueryClientProvider client={queryClient}>
        <SimpleLookupField uri="lookupUri" uuid="uuid1" onChange={() => {}} value={initialValue} isMulti={isMulti} />
      </QueryClientProvider>,
    );
  };

  describe('repeatability', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('when repeatable, set value to all initial values', async () => {
      const { findByText } = renderScreen(true);
      expect(await findByText('value-1')).toBeInTheDocument();
      expect(await findByText('value-2')).toBeInTheDocument();
    });

    test('when repeatable, library uses multiselect', async () => {
      const user = userEvent.setup();
      const { findByText, getByRole } = renderScreen(true);

      const activate = getByRole('combobox');
      await user.click(activate);
      const select = getByRole('listbox');
      await user.selectOptions(select, 'value-3');
      await user.keyboard('{enter}');

      expect(await findByText('value-1')).toBeInTheDocument();
      expect(await findByText('value-2')).toBeInTheDocument();
      expect(await findByText('value-3')).toBeInTheDocument();
    });

    test('when not repeatable, set only the first initial value', async () => {
      const { findByText, queryByText } = renderScreen(false);
      expect(await findByText('value-1')).toBeInTheDocument();
      expect(queryByText('value-2')).not.toBeInTheDocument();
    });

    test('when not repeatable, library uses single value select', async () => {
      const user = userEvent.setup();
      const { findByText, queryByText, getByRole } = renderScreen(false);

      const activate = getByRole('combobox');
      await user.click(activate);
      const select = getByRole('listbox');
      await user.selectOptions(select, 'value-3');
      await user.keyboard('{enter}');

      expect(queryByText('value-1')).not.toBeInTheDocument();
      expect(queryByText('value-2')).not.toBeInTheDocument();
      expect(await findByText('value-3')).toBeInTheDocument();
    });
  });
});
