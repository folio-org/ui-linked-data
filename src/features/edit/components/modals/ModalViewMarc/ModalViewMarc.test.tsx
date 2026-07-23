import { setInitialGlobalState } from '@/test/__mocks__/store';

import { render } from '@testing-library/react';
import { axe } from 'jest-axe';

import { useMarcPreviewStore } from '@/store';

import { ModalViewMarc } from './ModalViewMarc';

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
    setInitialGlobalState([
      {
        store: useMarcPreviewStore,
        state: { basicValue: mockMarcPreview },
      },
    ]);

    const { findByText } = render(<ModalViewMarc />);

    expect(await findByText(leader, { exact: false })).toBeInTheDocument();
    expect(await findByText(subfieldContent, { exact: false })).toBeInTheDocument();
  });

  describe('accessibility', () => {
    test('has no accessibility violations', async () => {
      setInitialGlobalState([
        {
          store: useMarcPreviewStore,
          state: { basicValue: mockMarcPreview },
        },
      ]);

      const { container } = render(<ModalViewMarc />);

      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });
  });
});
