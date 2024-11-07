import { PreviewExternalResourceControls } from '@components/PreviewExternalResourceControls';
import { fireEvent, screen } from '@testing-library/dom';
import { render } from '@testing-library/react';
import { RecoilRoot } from 'recoil';

const navigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => navigate,
}));

describe('PreviewExternalResourceControls', () => {
  beforeEach(() =>
    render(
      <RecoilRoot>
        <PreviewExternalResourceControls />
      </RecoilRoot>,
    ),
  );

  test('navigates back', () => {
    fireEvent.click(screen.getByTestId('close-external-preview-button'));

    expect(navigate).toHaveBeenCalled();
  });
});
