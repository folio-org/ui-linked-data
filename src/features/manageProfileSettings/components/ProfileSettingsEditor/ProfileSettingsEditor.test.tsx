import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@testing-library/react';

import { ProfileSettingsEditor } from './ProfileSettingsEditor';

describe('ProfileSettingsEditor', () => {
  // set initial global state with profile and settings

  it('renders', async () => {
    render(
      <MemoryRouter>
        <ProfileSettingsEditor />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('profile-settings-editor')).toBeInTheDocument();
  });
});
