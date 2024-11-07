import { render } from '@testing-library/react';
import { AuthRefType } from '@common/constants/search.constants';
import { AuthorizedFormatter } from '@components/ComplexLookupField/formatters';

describe('AuthorizedFormatter', () => {
  const defaultRow = {
    authorized: { label: '' },
  };

  it('renders label in bold when authorized', () => {
    const row = {
      ...defaultRow,
      authorized: { label: AuthRefType.Authorized },
    };

    const { getByText } = render(<AuthorizedFormatter row={row} />);
    const labelElement = getByText(AuthRefType.Authorized);

    expect(labelElement.tagName.toLowerCase()).toBe('b');
  });

  it('renders label in span when not authorized', () => {
    const row = {
      ...defaultRow,
      authorized: { label: 'Not Authorized' },
    };

    const { getByText } = render(<AuthorizedFormatter row={row} />);
    const labelElement = getByText('Not Authorized');

    expect(labelElement.tagName.toLowerCase()).toBe('span');
  });
});
