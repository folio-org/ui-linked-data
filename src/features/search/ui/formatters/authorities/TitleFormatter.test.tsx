import { fireEvent } from '@testing-library/dom';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';

import { TitleFormatter } from './TitleFormatter';

describe('TitleFormatter', () => {
  const defaultRow = {
    __meta: { id: '1', isAnchor: true },
    title: { label: 'Test Title' },
    subclass: { label: 'Subclass Label' },
    authorized: { label: 'Authorized Label' },
    authoritySource: { label: 'Authority Source Label' },
  };

  it('renders missing match query when isMissingMatchQuery is true', () => {
    const row = {
      ...defaultRow,
      __meta: { ...defaultRow.__meta, isAnchor: true },
      subclass: { label: '' },
      authorized: { label: '' },
      authoritySource: { label: '' },
    };

    const { getByText } = render(<TitleFormatter row={row} />);

    expect(getByText(row.title.label)).toBeInTheDocument();
  });

  it('renders Button when "isMissingMatchQuery" is false', () => {
    const row = {
      ...defaultRow,
      __meta: { ...defaultRow.__meta, isAnchor: false },
    };

    const { getByRole } = render(<TitleFormatter row={row} />);

    const button = getByRole('button', { name: row.title.label });
    expect(button).toBeInTheDocument();
  });

  it('calls "onTitleClick" with correct arguments when Button is clicked', () => {
    const onTitleClick = jest.fn();
    const row = { ...defaultRow };

    const { getByRole } = render(<TitleFormatter row={row} onTitleClick={onTitleClick} />);

    const button = getByRole('button');
    fireEvent.click(button);

    expect(onTitleClick).toHaveBeenCalledWith(row.__meta.id, row.title.label, row.subclass.label);
  });

  describe('accessibility', () => {
    test.each([
      [
        'isMissingMatchQuery is true',
        {
          ...defaultRow,
          __meta: { ...defaultRow.__meta, isAnchor: true },
          subclass: { label: '' },
          authorized: { label: '' },
          authoritySource: { label: '' },
        },
      ],
      ['isMissingMatchQuery is false', { ...defaultRow, __meta: { ...defaultRow.__meta, isAnchor: false } }],
    ])('has no accessibility violations when %s', async (_description, row) => {
      const { container } = render(<TitleFormatter row={row} />);

      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });
  });
});
