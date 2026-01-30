import { setInitialGlobalState } from '@/test/__mocks__/store';

import { fireEvent, render, screen } from '@testing-library/react';

import { useSearchContextLegacy } from '@/features/search/ui';

import { useMarcPreviewStore, useUIStore } from '@/store';

import { MarcPreviewLegacy } from './MarcPreview';

jest.mock('@/features/search/ui/providers');
jest.mock('@/common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: false }));
jest.mock('@/components/MarcContent', () => ({ MarcContent: () => <div>Marc Content</div> }));

const mockUseSearchContext = useSearchContextLegacy as jest.Mock;
const marcPreviewData = {
  metadata: {
    updatedDate: '2024-01-01',
  },
} as MarcDTO;
const marcPreviewMetadata = {
  title: 'Test Title',
  headingType: 'Test Heading',
  baseId: 'testBaseId_1',
} as MarcPreviewMetadata;

describe('MarcPreviewComplexLookup', () => {
  const onClose = jest.fn();
  const onAssignRecord = jest.fn();

  beforeEach(() => {
    mockUseSearchContext.mockReturnValue({ onAssignRecord });
  });

  const renderComponent = (
    isMarcPreviewOpen: boolean,
    marcPreviewData: MarcDTO,
    marcPreviewMetadata: MarcPreviewMetadata,
  ) => {
    setInitialGlobalState([
      {
        store: useMarcPreviewStore,
        state: { complexValue: marcPreviewData, metadata: marcPreviewMetadata },
      },
      {
        store: useUIStore,
        state: { isMarcPreviewOpen },
      },
    ]);

    return render(<MarcPreviewLegacy onClose={onClose} />);
  };

  it('renders the component when isMarcPreviewOpen is true and marcPreviewData is available', () => {
    renderComponent(true, marcPreviewData, marcPreviewMetadata);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Marc Content')).toBeInTheDocument();
  });

  it('does not render the component when isMarcPreviewOpen is false', () => {
    renderComponent(false, marcPreviewData, marcPreviewMetadata);

    expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    renderComponent(true, marcPreviewData, marcPreviewMetadata);

    fireEvent.click(screen.getByTestId('nav-close-button'));

    expect(onClose).toHaveBeenCalled();
  });

  it('calls onAssignRecord when assign button is clicked', () => {
    renderComponent(true, marcPreviewData, marcPreviewMetadata);

    fireEvent.click(screen.getByText('ld.assign'));

    expect(onAssignRecord).toHaveBeenCalledWith({
      id: 'testBaseId_1',
      title: 'Test Title',
      linkedFieldValue: 'Test Heading',
    });
  });
});
