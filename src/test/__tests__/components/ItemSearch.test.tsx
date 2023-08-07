import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ItemSearch } from '@components/ItemSearch';
import { getByIdentifier } from '@common/api/search.api';
import { RecoilRoot } from 'recoil';

jest.mock('@common/api/search.api', () => ({
  ...jest.requireActual('@common/api/search.api'),
  getByIdentifier: jest.fn(),
}));

const fetchRecord = jest.fn();

describe('Item Search', () => {
  const id = 'lccn';

  beforeEach(() =>
    render(
      <RecoilRoot>
        <ItemSearch fetchRecord={fetchRecord} />
      </RecoilRoot>,
    ),
  );

  test('renders Item Search component', () => {
    expect(screen.getByTestId('id-search')).toBeInTheDocument();
  });

  test('triggers search control', async () => {
    const ctl = screen.getByTestId(id);

    fireEvent.click(ctl);
    await waitFor(() => {
      expect(ctl).toBeChecked();
    });
  });

  test('searches the selected identifier for query', async () => {
    const ctl = screen.getByTestId(id);
    const event = {
      target: {
        value: 'test',
      },
    };

    fireEvent.click(ctl);
    fireEvent.change(screen.getByTestId('id-search-input'), event);
    fireEvent.click(screen.getByTestId('id-search-button'));

    await waitFor(() => {
      expect(getByIdentifier).toHaveBeenCalledWith(id, event.target.value);
    });
  });
});
