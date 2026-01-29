import { fetchExternalRecordForPreview } from '@/test/__mocks__/common/hooks/useRecordControls.mock';
import { setInitialGlobalState } from '@/test/__mocks__/store';

import { Fragment, ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@testing-library/react';

import { ExternalResourcePreview } from '@/views';

import { useInputsStore } from '@/store';

jest.mock('@/common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: false }));

jest.mock('react-intl', () => ({
  FormattedMessage: ({ id, values }: any) => {
    return (
      <div id={id}>
        {Object.entries(values).map(([k, v]) => (
          <Fragment key={k}>{v as ReactNode}</Fragment>
        ))}
      </div>
    );
  },
  useIntl: () => ({
    formatMessage: ({ id }: { id: string }) => id,
  }),
}));

describe('ExternalResourcePreview', () => {
  const renderComponent = (withRecord = false) => {
    setInitialGlobalState([
      {
        store: useInputsStore,
        state: { record: withRecord ? {} : null },
      },
    ]);

    return render(
      <MemoryRouter>
        <ExternalResourcePreview />
      </MemoryRouter>,
    );
  };

  test('calls fetchExternalRecordForPreview on externalId change', () => {
    renderComponent();

    expect(fetchExternalRecordForPreview).toHaveBeenCalled();
  });

  test('renders ExternalResourceLoader if no record is present', () => {
    renderComponent();

    expect(screen.getByTestId('external-resource-loader')).toBeInTheDocument();
  });

  test('renders Preview if record is present', () => {
    renderComponent(true);

    expect(screen.getByTestId('preview-fields')).toBeInTheDocument();
  });
});
