import { ViewMarcModal } from '@components/ViewMarcModal';
import state from '@state';
import { render } from '@testing-library/react';
import { RecoilRoot } from 'recoil';

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
  test('renders modal and its contents', async () => {
    const { findByText } = render(
      <RecoilRoot initializeState={snapshot => snapshot.set(state.data.marcPreview, mockMarcPreview)}>
        <ViewMarcModal />
      </RecoilRoot>,
    );

    expect(await findByText(leader, { exact: false })).toBeInTheDocument();
    expect(await findByText(subfieldContent, { exact: false })).toBeInTheDocument();
  });
});
