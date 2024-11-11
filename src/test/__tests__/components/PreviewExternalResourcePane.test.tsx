import { PreviewExternalResourcePane } from '@components/PreviewExternalResourcePane';
import state from '@state';
import { fireEvent, screen } from '@testing-library/dom';
import { render } from '@testing-library/react';
import { RecoilRoot } from 'recoil';

const navigate = jest.fn();
const getRecordTitle = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => navigate,
}));

jest.mock('@common/helpers/record.helper', () => ({
  getRecordTitle: () => getRecordTitle(),
}));

jest.mock('@common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: false }));

describe('PreviewExternalResourcePane', () => {
  beforeEach(() =>
    render(
      <RecoilRoot initializeState={snapshot => snapshot.set(state.inputs.record, {})}>
        <PreviewExternalResourcePane />
      </RecoilRoot>,
    ),
  );

  test('invokes getRecordTitle', () => {
    expect(getRecordTitle).toHaveBeenCalled();
  });

  test('navigates back', () => {
    fireEvent.click(screen.getByTestId('nav-close-button'));

    expect(navigate).toHaveBeenCalled();
  });
});
