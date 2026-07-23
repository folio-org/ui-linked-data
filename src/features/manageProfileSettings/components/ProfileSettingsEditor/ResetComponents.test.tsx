import { setInitialGlobalState } from '@/test/__mocks__/store';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';

import { useManageProfileSettingsStore } from '@/store';

import { ResetComponents } from './ResetComponents';

describe('ResetComponents', () => {
  const mockResetProfileSettings = jest.fn();

  it('is disabled when no changes have been made to components', () => {
    setInitialGlobalState([
      {
        store: useManageProfileSettingsStore,
        state: {
          isSettingsActive: false,
        },
      },
    ]);

    render(<ResetComponents />);

    expect(screen.getByTestId('reset-components')).toBeDisabled();
  });

  it('is enabled when changes have been made to components', () => {
    setInitialGlobalState([
      {
        store: useManageProfileSettingsStore,
        state: {
          isSettingsActive: true,
        },
      },
    ]);

    render(<ResetComponents />);

    expect(screen.getByTestId('reset-components')).toBeEnabled();
  });

  it('resets settings when clicked', async () => {
    setInitialGlobalState([
      {
        store: useManageProfileSettingsStore,
        state: {
          isSettingsActive: true,
          resetProfileSettings: mockResetProfileSettings,
        },
      },
    ]);

    render(<ResetComponents />);

    fireEvent.click(screen.getByTestId('reset-components'));

    await waitFor(() => {
      expect(screen.getByTestId('reset-components')).toBeDisabled();
      expect(mockResetProfileSettings).toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    test.each([
      ['no changes made to components', false],
      ['changes made to components', true],
    ])('has no accessibility violations when %s', async (_description, isSettingsActive) => {
      setInitialGlobalState([
        {
          store: useManageProfileSettingsStore,
          state: {
            isSettingsActive,
          },
        },
      ]);

      const { container } = render(<ResetComponents />);

      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });
  });
});
