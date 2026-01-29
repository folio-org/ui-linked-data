import { setInitialGlobalState } from '@/test/__mocks__/store';

import { fireEvent, screen } from '@testing-library/dom';
import { render } from '@testing-library/react';

import { PreviewExternalResourcePane } from '@/components/PreviewExternalResourcePane';

import { useInputsStore } from '@/store';

const navigate = jest.fn();
const getRecordTitle = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => navigate,
  useLocation: jest.fn(),
}));

jest.mock('@/common/helpers/record.helper', () => ({
  getRecordTitle: () => getRecordTitle(),
}));

jest.mock('@/common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: false }));

describe('PreviewExternalResourcePane', () => {
  beforeEach(() => {
    setInitialGlobalState([
      {
        store: useInputsStore,
        state: { record: {} },
      },
    ]);

    return render(<PreviewExternalResourcePane />);
  });

  test('invokes getRecordTitle', () => {
    expect(getRecordTitle).toHaveBeenCalled();
  });

  test('navigates back', () => {
    fireEvent.click(screen.getByTestId('nav-close-button'));

    expect(navigate).toHaveBeenCalled();
  });
});
