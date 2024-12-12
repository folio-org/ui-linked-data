import { navigateToEditPage } from '@src/test/__mocks__/common/hooks/useNavigateToEditPage.mock';
import { getRecordAndInitializeParsing } from '@src/test/__mocks__/common/hooks/useRecordControls.mock';
import * as RecordFormatter from '@common/helpers/recordFormatting.helper';
import { InstancesList } from '@components/InstancesList';
import { fireEvent, render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

jest.mock('@common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: true }));

describe('InstancesList', () => {
  const renderWithProps = () => {
    const contents = [
      {
        __meta: {
          id: 'mockId',
          key: 'mockId',
        },
        title: {
          label: 'mockTitle',
        },
        publisher: {
          label: 'mockPubName',
        },
        pubDate: {
          label: 'mockPubDate',
        },
      },
    ];

    jest.spyOn(RecordFormatter, 'formatDependeciesTable').mockReturnValue(contents);

    return render(
      <BrowserRouter>
        <InstancesList
          contents={{ keys: { uri: 'mockUri' }, entries: [{ key: 'value' }] }}
          type="mockType"
          refId="mockRefId"
        />
        ,
      </BrowserRouter>,
    );
  };
  test("renders table when there's content", () => {
    const { getByText } = renderWithProps();

    expect(getByText('mockTitle')).toBeInTheDocument();
  });

  test('invokes new instance control', () => {
    const { getByTestId } = renderWithProps();

    fireEvent.click(getByTestId('new-instance'));

    expect(navigateToEditPage).toHaveBeenCalled();
  });

  test('invokes preview control', () => {
    const { getByTestId } = renderWithProps();

    fireEvent.click(getByTestId('preview-button__mockId'));

    expect(getRecordAndInitializeParsing).toHaveBeenCalled();
  });

  test('invokes edit control', () => {
    const { getByTestId } = renderWithProps();

    fireEvent.click(getByTestId('edit-button__mockId'));

    expect(navigateToEditPage).toHaveBeenCalled();
  });
});
