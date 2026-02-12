import { IntlProvider } from 'react-intl';
import { BrowserRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';

import { fetchPreferredProfiles, fetchProfile, fetchProfileSettings, fetchProfiles } from '@/common/api/profiles.api';
import { BFLITE_URIS } from '@/common/constants/bibframeMapping.constants';
import { AdvancedFieldType } from '@/common/constants/uiControls.constants';

import { ManageProfileSettings } from './ManageProfileSettings';

jest.mock('@/common/api/profiles.api', () => ({
  fetchProfiles: jest.fn(),
  fetchPreferredProfiles: jest.fn(),
  fetchProfile: jest.fn(),
  fetchProfileSettings: jest.fn(),
}));

const renderComponent = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <BrowserRouter>
      <IntlProvider locale="en">
        <QueryClientProvider client={queryClient}>
          <ManageProfileSettings />
        </QueryClientProvider>
      </IntlProvider>
    </BrowserRouter>,
  );
};

describe('ManageProfileSettings', () => {
  const mockProfiles = [
    {
      id: 'one-profile',
      name: 'One Profile',
      resourceTypeURL: BFLITE_URIS.INSTANCE,
    },
    {
      id: 'two-profile',
      name: 'Two Profile',
      resourceTypeURL: BFLITE_URIS.INSTANCE,
    },
  ];
  const mockPreferredProfiles = [
    {
      id: 'one-profile',
      name: 'One Profile',
      resourceTypeURL: BFLITE_URIS.INSTANCE,
    },
  ];
  const mockProfile = [
    {
      id: 'one-profile',
      displayName: 'Test Profile',
      type: AdvancedFieldType.block,
      children: ['test:childA', 'test:childB', 'test:childC'],
    },
    {
      id: 'test:childA',
      type: AdvancedFieldType.literal,
      displayName: 'Child A',
    },
    {
      id: 'test:childB',
      type: AdvancedFieldType.literal,
      displayName: 'Child B',
    },
    {
      id: 'test:childC',
      type: AdvancedFieldType.literal,
      displayName: 'Child C',
    },
  ];
  const mockProfileSettings = {
    active: false,
    children: [],
  };

  beforeEach(() => {
    (fetchProfiles as jest.Mock).mockResolvedValue(mockProfiles);
    (fetchPreferredProfiles as jest.Mock).mockResolvedValue(mockPreferredProfiles);
    (fetchProfile as jest.Mock).mockResolvedValue(mockProfile);
    (fetchProfileSettings as jest.Mock).mockResolvedValue(mockProfileSettings);
    renderComponent();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders main component', () => {
    expect(screen.getByTestId('manage-profile-settings')).toBeInTheDocument();
  });

  it('renders profiles list', () => {
    waitFor(() => {
      expect(screen.getByTestId('profiles-list')).toBeInTheDocument();
    });
  });

  it('renders profile settings with an auto-selected profile', () => {
    waitFor(() => {
      expect(screen.getByTestId('profile-settings')).toBeInTheDocument();
    });
  });

  describe('nudge buttons', () => {
    it('nudge up shifts location and switches toggle to custom', () => {
      fireEvent.click(screen.getAllByTestId('resource-profile-item')[0]);

      waitFor(() => {
        expect(screen.getByTestId('profile-settings')).toBeInTheDocument();
      });

      const component = screen.getByTestId('component-test:childC');
      const nudgeUpButton = within(component).getByTestId('nudge-up');

      expect(screen.getByTestId('settings-active-custom')).not.toBeChecked();

      fireEvent.click(nudgeUpButton);
      fireEvent.click(nudgeUpButton);

      waitFor(() => {
        expect(screen.getByTestId('settings-active-custom')).toBeChecked();
        expect(screen.getByTestId('component-test:childC')).toAppearBefore(screen.getByTestId('component-test:childA'));
        expect(screen.getByTestId('component-test:childC')).toAppearBefore(screen.getByTestId('component-test:childB'));
      });
    });

    it('nudge down shifts location and switches toggle to custom', () => {
      fireEvent.click(screen.getAllByTestId('resource-profile-item')[0]);

      waitFor(() => {
        expect(screen.getByTestId('profile-settings')).toBeInTheDocument();
      });

      const component = screen.getByTestId('component-test:childA');
      const nudgeDownButton = within(component).getByTestId('nudge-down');

      expect(screen.getByTestId('settings-active-custom')).not.toBeChecked();

      fireEvent.click(nudgeDownButton);
      fireEvent.click(nudgeDownButton);

      waitFor(() => {
        expect(screen.getByTestId('settings-active-custom')).toBeChecked();
        expect(screen.getByTestId('component-test:childB')).toAppearBefore(screen.getByTestId('component-test:childA'));
        expect(screen.getByTestId('component-test:childC')).toAppearBefore(screen.getByTestId('component-test:childA'));
      });
    });
  });

  describe('context menu move', () => {
    it('moves an unused component to the bottom of the selected list and switches toggle to custom', () => {
      // move from selected to unused, then unused to selected
      // check that it's now at the bottom
      fireEvent.click(screen.getAllByTestId('resource-profile-item')[0]);

      waitFor(() => {
        expect(screen.getByTestId('profile-settings')).toBeInTheDocument();
      });

      const component = screen.getByTestId('component-test:childB');
      const menuButton = within(component).getByTestId('activate-menu');

      expect(screen.getByTestId('settings-active-custom')).not.toBeChecked();

      fireEvent.click(menuButton);
      fireEvent.click(within(component).getByTestId('move-action'));

      // move back
      fireEvent.click(menuButton);
      fireEvent.click(within(component).getByTestId('move-action'));

      waitFor(() => {
        expect(screen.getByTestId('settings-active-custom')).toBeChecked();
        const section = screen.getByTestId('selected-component-list');
        expect(within(section).getByTestId('component-test:childB')).toBeInTheDocument();
        expect(screen.getByTestId('component-test:childA')).toAppearBefore(screen.getByTestId('component-test:childB'));
        expect(screen.getByTestId('component-test:childC')).toAppearBefore(screen.getByTestId('component-test:childB'));
      });
    });

    it('moves a selected component to the unused list and switches toggle to custom', () => {
      fireEvent.click(screen.getAllByTestId('resource-profile-item')[0]);

      waitFor(() => {
        expect(screen.getByTestId('profile-settings')).toBeInTheDocument();
      });

      const component = screen.getByTestId('component-test:childC');
      const menuButton = within(component).getByTestId('activate-menu');

      expect(screen.getByTestId('settings-active-custom')).not.toBeChecked();

      fireEvent.click(menuButton);
      fireEvent.click(within(component).getByTestId('move-action'));

      waitFor(() => {
        expect(screen.getByTestId('settings-active-custom')).toBeChecked();
        const section = screen.getByTestId('unused-component-list');
        expect(within(section).getByTestId('component-test:childC')).toBeInTheDocument();
      });
    });
  });

  describe('toggle between default and custom', () => {
    it('clears all settings when toggled from custom to default', () => {
      fireEvent.click(screen.getAllByTestId('resource-profile-item')[0]);

      waitFor(() => {
        expect(screen.getByTestId('profile-settings')).toBeInTheDocument();
      });

      // nudge
      const nudgeComponent = screen.getByTestId('component-test:childC');
      const nudgeUpButton = within(nudgeComponent).getByTestId('nudge-up');

      expect(screen.getByTestId('settings-active-custom')).not.toBeChecked();

      fireEvent.click(nudgeUpButton);

      // move
      const moveComponent = screen.getByTestId('component-test:childA');
      const menuButton = within(moveComponent).getByTestId('activate-menu');

      expect(screen.getByTestId('settings-active-custom')).toBeChecked();

      fireEvent.click(menuButton);
      fireEvent.click(within(moveComponent).getByTestId('move-action'));

      // toggle back to default
      fireEvent.click(screen.getByTestId('settings-active-default'));

      waitFor(() => {
        expect(screen.getByTestId('settings-active-custom')).not.toBeChecked();
        const section = screen.getByTestId('selected-component-list');
        expect(within(section).getByTestId('component-test:childA')).toBeInTheDocument();
        expect(within(section).getByTestId('component-test:childB')).toBeInTheDocument();
        expect(within(section).getByTestId('component-test:childC')).toBeInTheDocument();
      });
    });
  });

  describe('responsive display', () => {
    const setViewport = (width: number) => {
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: width });
    };

    it('displays profiles list and settings editor side by side when viewport is wide enough', () => {
      setViewport(1400);

      waitFor(() => {
        expect(screen.getByTestId('profiles-list')).toBeVisible();
        expect(screen.getByTestId('profile-settings')).toBeVisible();
      });
    });

    it('displays settings editor only when viewport is resized from wide to narrow', () => {
      setViewport(1400);

      waitFor(() => {
        expect(screen.getByTestId('profiles-list')).toBeVisible();
        expect(screen.getByTestId('profile-settings')).toBeVisible();
      });

      setViewport(600);

      waitFor(() => {
        expect(screen.getByTestId('profiles-list')).not.toBeVisible();
        expect(screen.getByTestId('profile-settings')).toBeVisible();
      });
    });

    it('displays only profiles list when viewport is narrow', () => {
      setViewport(600);

      waitFor(() => {
        expect(screen.getByTestId('profiles-list')).toBeVisible();
        expect(screen.getByTestId('profile-settings')).not.toBeVisible();
      });
    });

    it('displays only settings editor after selecting a profile from list when viewport is narrow', () => {
      setViewport(600);

      fireEvent.click(screen.getAllByTestId('resource-profile-item')[0]);

      waitFor(() => {
        expect(screen.getByTestId('profiles-list')).not.toBeVisible();
        expect(screen.getByTestId('profile-settings')).toBeVisible();
      });
    });

    it('displays only profile list after returning from settings when viewport is narrow', () => {
      setViewport(600);

      fireEvent.click(screen.getAllByTestId('resource-profile-item')[0]);
      fireEvent.click(screen.getByTestId('back-to-profiles-list'));

      waitFor(() => {
        expect(screen.getByTestId('profiles-list')).toBeVisible();
        expect(screen.getByTestId('profile-settings')).not.toBeVisible();
      });
    });

    it('select, back, and return to settings when viewport is narrow', () => {
      setViewport(600);

      fireEvent.click(screen.getAllByTestId('resource-profile-item')[0]);
      fireEvent.click(screen.getByTestId('back-to-profiles-list'));
      fireEvent.click(screen.getAllByTestId('resource-profile-item')[0]);

      waitFor(() => {
        expect(screen.getByTestId('profiles-list')).not.toBeVisible();
        expect(screen.getByTestId('profile-settings')).toBeVisible();
      });
    });
  });
});
