import { fireEvent, screen } from '@testing-library/dom';
import { render } from '@testing-library/react';

import { PreviewExternalResourcePane } from '@/views/ExternalResource/components/PreviewExternalResourcePane';

const navigate = jest.fn();
const getRecordTitle = jest.fn();
const mockUseResourcePreviewQuery = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => navigate,
  useLocation: jest.fn(),
  useParams: () => ({ externalId: 'ext-1' }),
}));

jest.mock('@/common/helpers/record.helper', () => ({
  getRecordTitle: () => getRecordTitle(),
}));

jest.mock('@/common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: false }));

jest.mock('@/features/resources', () => ({
  useResourcePreviewQuery: (...args: unknown[]) => mockUseResourcePreviewQuery(...args),
}));

const mockRecord = { resource: {} } as unknown as RecordEntry;

describe('PreviewExternalResourcePane', () => {
  beforeEach(() => {
    mockUseResourcePreviewQuery.mockReturnValue({ data: { record: mockRecord } });

    return render(<PreviewExternalResourcePane />);
  });

  test('invokes getRecordTitle when query data is available', () => {
    expect(getRecordTitle).toHaveBeenCalled();
  });

  test('does not invoke getRecordTitle when query has no data', () => {
    getRecordTitle.mockClear();
    mockUseResourcePreviewQuery.mockReturnValue({ data: null });

    render(<PreviewExternalResourcePane />);

    expect(getRecordTitle).not.toHaveBeenCalled();
  });

  test('navigates back', () => {
    fireEvent.click(screen.getByTestId('nav-close-button'));

    expect(navigate).toHaveBeenCalled();
  });
});
