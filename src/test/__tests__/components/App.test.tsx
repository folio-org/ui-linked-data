import '@/test/__mocks__/common/helpers/pageScrolling.helper.mock';

import { render, screen } from '@testing-library/react';

import { App } from '@/App';

jest.mock('@/common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: false }));

describe('App', () => {
  beforeEach(() => {
    render(<App />);
  });

  test('renders Loading (default) component', () => {
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });
});
