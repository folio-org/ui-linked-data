import { PreviewExternalResourceControls } from '@components/PreviewExternalResourceControls';
import { fireEvent, screen, waitFor } from '@testing-library/dom';
import { render } from '@testing-library/react';
import * as ReactRouterDom from 'react-router-dom';
import * as RecordsApi from '@common/api/records.api';
import { RecoilRoot } from 'recoil';

const navigate = jest.fn();

jest.mock('@common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: true }));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => navigate,
}));

describe('PreviewExternalResourceControls', () => {
  const renderComponent = () =>
    render(
      <RecoilRoot>
        <ReactRouterDom.MemoryRouter>
          <PreviewExternalResourceControls />
        </ReactRouterDom.MemoryRouter>
      </RecoilRoot>,
    );

  describe('continue', () => {
    test("doesn't navigate forward if no id is present", () => {
      jest.spyOn(ReactRouterDom, 'useParams').mockReturnValue({});
      renderComponent();

      fireEvent.click(screen.getByTestId('continue-external-preview-button'));

      expect(navigate).not.toHaveBeenCalled();
    });

    test('navigates if id is present', async () => {
      jest.spyOn(ReactRouterDom, 'useParams').mockReturnValue({ externalId: 'mockExternalId' });
      jest.spyOn(RecordsApi, 'getGraphIdByExternalId').mockResolvedValue({ id: 'mockId' });
      renderComponent();

      fireEvent.click(screen.getByTestId('continue-external-preview-button'));

      await waitFor(() => {
        expect(navigate).toHaveBeenCalled();
      });
    });
  });

  test('navigates back', () => {
    renderComponent();

    fireEvent.click(screen.getByTestId('close-external-preview-button'));

    expect(navigate).toHaveBeenCalled();
  });
});
