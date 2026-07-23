import { navigateToEditPage } from '@/test/__mocks__/common/hooks/useNavigateToEditPage.mock';

import { BrowserRouter } from 'react-router-dom';

import { fireEvent, render } from '@testing-library/react';
import { axe } from 'jest-axe';

import { ITitledPreview, TitledPreview } from './TitledPreview';

jest.mock('@/common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: true }));

describe('TitledPreview', () => {
  const defaultProps = {
    showCloseCtl: true,
    type: 'work',
    onClickClose: jest.fn(),
    previewContent: {
      title: 'mockTitle',
      schema: new Map(),
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

  describe('accessibility', () => {
    test.each([
      ["there's preview content", defaultProps],
      ["there's no preview content", { ...defaultProps, previewContent: undefined }],
    ])('has no accessibility violations when %s', async (_description, props) => {
      const { container } = renderWithProps(props);

      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });
  });
});
