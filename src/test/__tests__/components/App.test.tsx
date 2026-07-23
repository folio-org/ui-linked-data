import '@/test/__mocks__/common/helpers/pageScrolling.helper.mock';

import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';

import { App } from '@/App';

jest.mock('@/common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: false }));

describe('App', () => {
  let container: HTMLElement;

  beforeEach(() => {
    ({ container } = render(<App />));
  });

  test('renders Loading (default) component', () => {
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  describe('accessibility', () => {
    test('has no accessibility violations', async () => {
      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });
  });
});
