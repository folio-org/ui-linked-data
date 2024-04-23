import '@src/test/__mocks__/common/helpers/pageScrolling.helper.mock';
import { App } from '@src/App';
import { render, screen } from '@testing-library/react';

jest.mock('@common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: false }));

describe('App', () => {
  beforeEach(() => {
    render(<App />);
  });

  test('renders Root (default) component', () => {
    expect(screen.getByTestId('root')).toBeInTheDocument();
  });
});
