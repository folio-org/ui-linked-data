import '@src/test/__mocks__/common/helpers/pageScrolling.helper.mock';
import { render, screen, fireEvent } from '@testing-library/react';
import { ScrollToTop } from '@components/ScrollToTop';
import { scrollToTop } from '@src/test/__mocks__/common/helpers/pageScrolling.helper.mock';

describe('ScrollToTop', () => {
  test('renders ScrollToTop component', () => {
    render(<ScrollToTop />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('renders ScrollToTop with class names', () => {
    const { container } = render(<ScrollToTop className="test-class-name" />);

    expect(container.getElementsByClassName('test-class-name')).toHaveLength(1);
  });

  test('calls scrollToTop function on click', () => {
    render(<ScrollToTop />);

    fireEvent.click(screen.getByRole('button'));

    expect(scrollToTop).toHaveBeenCalledTimes(1);
  });
});
