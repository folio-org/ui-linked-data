import '@src/test/__mocks__/common/hooks/useRecordControls.mock';
import { Load } from '@views';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { BrowserRouter } from 'react-router-dom';
import * as recordsApi from '@common/api/records.api';
import { fetchRecord } from '@src/test/__mocks__/common/hooks/useRecordControls.mock';

const withLabel = 'test-id, Resource description ID: 1';
const withoutLabel = 'Resource description ID: 2';

describe('Load', () => {
  beforeEach(async () => {
    jest.spyOn(recordsApi, 'getAllRecords').mockImplementation(() =>
      Promise.resolve({
        content: [
          {
            id: 1,
            label: 'test-id',
          },
          {
            id: 2,
            label: '',
          },
        ],
      }),
    );

    await waitFor(() => {
      render(
        <RecoilRoot>
          <BrowserRouter>
            <Load />
          </BrowserRouter>
        </RecoilRoot>,
      );
    });
  });

  test('renders Load component', async () => {
    expect(await screen.findByTestId('load')).toBeInTheDocument();
  });

  test('renders records with relevant formatting if there are any', async () => {
    expect(await screen.findByText(withLabel)).toBeInTheDocument();
    expect(await screen.findByText(withoutLabel)).toBeInTheDocument();
  });

  test('calls fetchRecord on record click', async () => {
    fireEvent.click(await screen.findByText(withLabel));

    expect(fetchRecord).toHaveBeenCalled();
  });
});
