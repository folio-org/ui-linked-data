import { fetchExternalRecordForPreview } from '@src/test/__mocks__/common/hooks/useRecordControls.mock';
import '@src/test/__mocks__/common/hooks/useRecordControls.mock';
import state from '@state';
import { render, screen } from '@testing-library/react';
import { ExternalResourcePreview } from '@views';
import { Fragment, ReactNode } from 'react';
import { RecoilRoot } from 'recoil';

jest.mock('@common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: false }));

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
}));

describe('ExternalResourcePreview', () => {
  const renderComponent = (withRecord = false) =>
    render(
      <RecoilRoot initializeState={snapshot => snapshot.set(state.inputs.record, withRecord ? {} : null)}>
        <ExternalResourcePreview />
      </RecoilRoot>,
    );

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
