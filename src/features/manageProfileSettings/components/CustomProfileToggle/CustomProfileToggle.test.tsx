import { setInitialGlobalState } from '@/test/__mocks__/store';

import { MemoryRouter } from 'react-router-dom';

import { fireEvent, render, screen } from '@testing-library/react';

import { useManageProfileSettingsState } from '@/store';

import { CustomProfileToggle } from './CustomProfileToggle';

describe('CustomProfileToggle', () => {
  const mockSetIsModified = jest.fn();

  const renderComponent = (active: boolean) => {
    setInitialGlobalState([
      {
        store: useManageProfileSettingsState,
        state: {
          isSettingsActive: active,
          setIsModified: mockSetIsModified,
        },
      },
    ]);

    return render(
      <MemoryRouter>
        <CustomProfileToggle />
      </MemoryRouter>,
    );
  };

  it('renders with default checked when settings are not active', () => {
    renderComponent(false);

    expect(screen.getByTestId('settings-active-default')).toBeChecked();
    expect(screen.getByTestId('settings-active-custom')).not.toBeChecked();
  });

  it('renders with custom checked when settings are active', () => {
    renderComponent(true);

    expect(screen.getByTestId('settings-active-default')).not.toBeChecked();
    expect(screen.getByTestId('settings-active-custom')).toBeChecked();
  });

  it('updates active value with interaction', () => {
    renderComponent(false);

    fireEvent.click(screen.getByTestId('settings-active-custom'));

    expect(mockSetIsModified).toHaveBeenLastCalledWith(true);
    expect(screen.getByTestId('settings-active-custom')).toBeChecked();
  });
});
