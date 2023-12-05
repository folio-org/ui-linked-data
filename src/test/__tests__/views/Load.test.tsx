import '@src/test/__mocks__/common/hooks/useRecordControls.mock';
import '@src/test/__mocks__/common/helpers/pageScrolling.helper.mock';
import { Edit, Load } from '@views';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import * as recordsApi from '@common/api/records.api';

const { getByTestId, findByTestId } = screen;

jest.mock('@common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: false }));

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
          <BrowserRouter basename="/">
            <Routes>
              <Route path="/" element={<Load />} />
              <Route path="/resources/:resourceId/edit" element={<Edit />} />
            </Routes>
          </BrowserRouter>
        </RecoilRoot>,
      );
    });
  });

  test('renders Load component', async () => {
    expect(await findByTestId('load')).toBeInTheDocument();
  });

  test('loads Edit page on record click', async () => {
    fireEvent.click(getByTestId('edit-button-1'));

    await waitFor(() => {
      expect(getByTestId('edit-page')).toBeInTheDocument();
    });
  });
});
