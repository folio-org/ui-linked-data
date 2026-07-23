import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';

import { DuplicateGroup } from './DuplicateGroup';

describe('DuplicateGroup', () => {
  const { getByTestId, queryByTestId } = screen;
  const onClick = jest.fn();

  function renderComponent(hasDeleteButton = true) {
    return render(<DuplicateGroup onClickDuplicate={onClick} hasDeleteButton={hasDeleteButton} htmlId="mockHtmlId" />);
  }

  test('renders DuplicateGroup component', () => {
    renderComponent();

    expect(getByTestId('mockHtmlId--addDuplicate')).toBeInTheDocument();
    expect(getByTestId('mockHtmlId--removeDuplicate')).toBeInTheDocument();
  });

  test('renders DuplicateGroup component without "Delete" button', () => {
    renderComponent(false);

    expect(queryByTestId('mockHtmlId--removeDuplicate')).not.toBeInTheDocument();
  });

  test('invokes passed "onClick" function', () => {
    renderComponent();

    fireEvent.click(screen.getByTestId('mockHtmlId--addDuplicate'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  describe('accessibility', () => {
    test.each([
      ['default', true],
      ['without "Delete" button', false],
    ])('has no accessibility violations when %s', async (_description, hasDeleteButton) => {
      const { container } = renderComponent(hasDeleteButton);

      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });
  });
});
