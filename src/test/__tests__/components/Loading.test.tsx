import { render } from '@testing-library/react';

import { Loading } from '@/components/Loading';

describe('Loading', () => {
  test('renders Loading component', () => {
    const { container } = render(<Loading />);

    expect(container.querySelector('.loader-overlay')).toBeInTheDocument();
    expect(container.querySelector('.loader')).toBeInTheDocument();
  });
});
