import { navigateToEditPage } from '@src/test/__mocks__/common/hooks/useNavigateToEditPage.mock';
import { fireEvent, render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ITitledPreview, TitledPreview } from '@components/Preview/TitledPreview';

jest.mock('@common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: true }));

describe('TitledPreview', () => {
  const defaultProps = {
    showCloseCtl: true,
    type: 'work',
    onClickClose: jest.fn(),
    previewContent: {
      title: 'mockTitle',
      id: 'mockId',
      base: new Map(),
      initKey: 'mockInitKey',
      userValues: {},
      selectedEntries: [],
    },
  };

  const renderWithProps = (props: Partial<ITitledPreview> | undefined = defaultProps) =>
    render(
      <BrowserRouter>
        <TitledPreview ownId="mockOwnId" refId="mockRefId" {...props} />,
      </BrowserRouter>,
    );

  test("renders view appropriate for when there's preview content", () => {
    const { getByTestId } = renderWithProps();

    expect(getByTestId('nav-close-button')).toBeInTheDocument();
  });

  test("renders view appropriate for when there's no preview content (single dep)", () => {
    const { queryByTestId } = renderWithProps({ ...defaultProps, previewContent: undefined });

    expect(queryByTestId('nav-close-button')).not.toBeInTheDocument();
  });

  test('navigates to ref edit page', () => {
    const { getByTestId } = renderWithProps({ ...defaultProps, previewContent: undefined });

    fireEvent.click(getByTestId('edit-self-as-ref'));

    expect(navigateToEditPage).toHaveBeenCalled();
  });

  test('navigates to own edit page', () => {
    const { getByTestId } = renderWithProps({ ...defaultProps, type: 'instance' });

    fireEvent.click(getByTestId('preview-actions-dropdown'));
    fireEvent.click(getByTestId('preview-actions-dropdown__option-ld.edit'));

    expect(navigateToEditPage).toHaveBeenCalled();
  });
});
