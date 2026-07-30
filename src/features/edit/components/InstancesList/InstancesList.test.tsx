import { onCreateNewResource } from '@/test/__mocks__/common/hooks/useNavigateToCreatePage.mock';
import { navigateToEditPage } from '@/test/__mocks__/common/hooks/useNavigateToEditPage.mock';

import { BrowserRouter } from 'react-router-dom';

import { fireEvent, render } from '@testing-library/react';
import { axe } from 'jest-axe';

import * as RecordFormatter from '@/common/helpers/recordFormatting.helper';

import { InstancesList } from './InstancesList';

jest.mock('@/common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: true }));

describe('InstancesList', () => {
  const onSelectInstance = jest.fn();

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
          onSelectInstance={onSelectInstance}
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

    expect(onCreateNewResource).toHaveBeenCalledWith({
      resourceTypeURL: expect.any(String),
      queryParams: {
        type: 'mockType',
        refId: 'mockRefId',
      },
    });
  });

  test('invokes preview control', () => {
    const { getByTestId } = renderWithProps();

    fireEvent.click(getByTestId('preview-button__mockId'));

    expect(onSelectInstance).toHaveBeenCalledWith('mockId');
  });

  test('invokes edit control', () => {
    const { getByTestId } = renderWithProps();

    fireEvent.click(getByTestId('edit-button__mockId'));

    expect(navigateToEditPage).toHaveBeenCalled();
  });

  describe('accessibility', () => {
    test('has no accessibility violations', async () => {
      const { container } = renderWithProps();

      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });
  });
});
