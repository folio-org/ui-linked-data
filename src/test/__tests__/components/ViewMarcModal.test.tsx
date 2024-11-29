import { ViewMarcModal } from '@components/ViewMarcModal';
import { useMarcPreviewStore } from '@src/store';
import { render } from '@testing-library/react';

const { leader, subfieldContent } = {
  leader: '372489',
  subfieldContent: 'y0u',
};

const mockMarcPreview = {
  id: '80085',
  parsedRecord: {
    content: {
      leader,
      fields: [
        {
          '123': '4',
        },
        {
          m1: {
            subfields: [
              {
                '5': subfieldContent,
              },
            ],
            ind1: ' ',
            ind2: ' ',
          },
        },
      ],
    },
  },
};

describe('ViewMarcModal', () => {
  const initialMarcPreviewState = useMarcPreviewStore.getState();

  test('renders modal and its contents', async () => {
    useMarcPreviewStore.setState({
      ...initialMarcPreviewState,
      value: mockMarcPreview,
    });

    const { findByText } = render(<ViewMarcModal />);

    expect(await findByText(leader, { exact: false })).toBeInTheDocument();
    expect(await findByText(subfieldContent, { exact: false })).toBeInTheDocument();
  });
});
