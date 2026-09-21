import { createModalContainer } from '@/test/__mocks__/common/misc/createModalContainer.mock';

import { IntlProvider } from 'react-intl';
import { BrowserRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { axe } from 'jest-axe';

import {
  fetchAllSettingsForProfile,
  fetchPreferredProfiles,
  fetchProfile,
  fetchProfileSettings,
  fetchProfiles,
} from '@/common/api/profiles.api';
import { BFLITE_URIS } from '@/common/constants/bibframeMapping.constants';
import { AdvancedFieldType } from '@/common/constants/uiControls.constants';

import { ManageProfileSettings } from './ManageProfileSettings';

const ORIGINAL_INNER_WIDTH = window.innerWidth;

jest.mock('@/common/api/profiles.api', () => ({
  fetchProfiles: jest.fn(),
  fetchPreferredProfiles: jest.fn(),
  fetchProfile: jest.fn(),
  fetchProfileSettings: jest.fn(),
  fetchAllSettingsForProfile: jest.fn(),
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
  const mockAllSettingsForProfile = [
    {
      id: 1,
      profileId: 'one-profile',
      name: 'one',
    },
  ];

  let container: HTMLElement;

  beforeEach(async () => {
    createModalContainer();
    (fetchProfiles as jest.Mock).mockResolvedValue(mockProfiles);
    (fetchPreferredProfiles as jest.Mock).mockResolvedValue(mockPreferredProfiles);
    (fetchProfile as jest.Mock).mockResolvedValue(mockProfile);
    (fetchProfileSettings as jest.Mock).mockResolvedValue(mockProfileSettings);
    (fetchAllSettingsForProfile as jest.Mock).mockResolvedValue(mockAllSettingsForProfile);
    ({ container } = renderComponent());
    await screen.findByTestId('manage-profile-settings');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders main component', () => {
    expect(screen.getByTestId('manage-profile-settings')).toBeInTheDocument();
  });

  it('renders profiles list', async () => {
    await waitFor(() => {
      expect(screen.getByTestId('profiles-list')).toBeInTheDocument();
    });
  });

  it('renders profile settings with an auto-selected profile', async () => {
    await waitFor(() => {
      expect(screen.getByTestId('profile-settings')).toBeInTheDocument();
    });
  });

  describe('nudge buttons', () => {
    it('nudge up shifts location and switches toggle to custom', async () => {
      fireEvent.click(screen.getAllByTestId('resource-profile-item')[0]);

      await waitFor(() => {
        expect(screen.getByTestId('profile-settings')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('profile-settings-select-create'));

      await waitFor(() => {
        expect(screen.getByTestId('component-test:childC')).toBeInTheDocument();
      });

      const component = screen.getByTestId('component-test:childC');
      const nudgeUpButton = within(component).getByTestId('nudge-up');

      expect(screen.getByTestId('reset-components')).toBeDisabled();

      fireEvent.click(nudgeUpButton);
      fireEvent.click(nudgeUpButton);

      await waitFor(() => {
        expect(screen.getByTestId('reset-components')).toBeEnabled();
        expect(screen.getByTestId('component-test:childC')).toAppearBefore(screen.getByTestId('component-test:childA'));
        expect(screen.getByTestId('component-test:childC')).toAppearBefore(screen.getByTestId('component-test:childB'));
      });
    });

    it('nudge down shifts location and switches toggle to custom', async () => {
      fireEvent.click(screen.getAllByTestId('resource-profile-item')[0]);

      await waitFor(() => {
        expect(screen.getByTestId('profile-settings')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('profile-settings-select-create'));

      await waitFor(() => {
        expect(screen.getByTestId('component-test:childA')).toBeInTheDocument();
      });

      const component = screen.getByTestId('component-test:childA');
      const nudgeDownButton = within(component).getByTestId('nudge-down');

      expect(screen.getByTestId('reset-components')).toBeDisabled();

      fireEvent.click(nudgeDownButton);
      fireEvent.click(nudgeDownButton);

      await waitFor(() => {
        expect(screen.getByTestId('reset-components')).toBeEnabled();
        expect(screen.getByTestId('component-test:childB')).toAppearBefore(screen.getByTestId('component-test:childA'));
        expect(screen.getByTestId('component-test:childC')).toAppearBefore(screen.getByTestId('component-test:childA'));
      });
    });
  });

  describe('context menu move', () => {
    it('moves an unused component to the bottom of the selected list and switches toggle to custom', async () => {
      // move from selected to unused, then unused to selected
      // check that it's now at the bottom
      fireEvent.click(screen.getAllByTestId('resource-profile-item')[0]);

      await waitFor(() => {
        expect(screen.getByTestId('profile-settings')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('profile-settings-select-create'));

      await waitFor(() => {
        expect(screen.getByTestId('component-test:childB')).toBeInTheDocument();
      });

      let component = screen.getByTestId('component-test:childB');
      let menuButton = within(component).getByTestId('activate-menu');

      expect(screen.getByTestId('reset-components')).toBeDisabled();

      fireEvent.click(menuButton);
      fireEvent.click(within(component).getByTestId('move-action'));

      // move back
      component = screen.getByTestId('component-test:childB');
      menuButton = within(component).getByTestId('activate-menu');

      fireEvent.click(menuButton);
      fireEvent.click(within(component).getByTestId('move-action'));

      await waitFor(() => {
        expect(screen.getByTestId('reset-components')).toBeEnabled();
        const section = screen.getByTestId('selected-component-list');
        expect(within(section).getByTestId('component-test:childB')).toBeInTheDocument();
        expect(screen.getByTestId('component-test:childA')).toAppearBefore(screen.getByTestId('component-test:childB'));
        expect(screen.getByTestId('component-test:childC')).toAppearBefore(screen.getByTestId('component-test:childB'));
      });
    });

    it('moves a selected component to the unused list and switches toggle to custom', async () => {
      fireEvent.click(screen.getAllByTestId('resource-profile-item')[0]);

      await waitFor(() => {
        expect(screen.getByTestId('profile-settings')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('profile-settings-select-create'));

      await waitFor(() => {
        expect(screen.getByTestId('component-test:childC')).toBeInTheDocument();
      });

      const component = screen.getByTestId('component-test:childC');
      const menuButton = within(component).getByTestId('activate-menu');

      expect(screen.getByTestId('reset-components')).toBeDisabled();

      fireEvent.click(menuButton);
      fireEvent.click(within(component).getByTestId('move-action'));

      await waitFor(() => {
        expect(screen.getByTestId('reset-components')).toBeEnabled();
        const section = screen.getByTestId('unused-component-list');
        expect(within(section).getByTestId('component-test:childC')).toBeInTheDocument();
      });
    });
  });

  describe('reset components', () => {
    it('clears all changes to components when clicked', async () => {
      fireEvent.click(screen.getAllByTestId('resource-profile-item')[0]);

      await waitFor(() => {
        expect(screen.getByTestId('profile-settings')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('profile-settings-select-create'));

      await waitFor(() => {
        expect(screen.getByTestId('component-test:childC')).toBeInTheDocument();
      });

      // nudge
      const nudgeComponent = screen.getByTestId('component-test:childC');
      const nudgeUpButton = within(nudgeComponent).getByTestId('nudge-up');

      expect(screen.getByTestId('reset-components')).toBeDisabled();

      fireEvent.click(nudgeUpButton);

      // move
      const moveComponent = screen.getByTestId('component-test:childA');
      const menuButton = within(moveComponent).getByTestId('activate-menu');

      expect(screen.getByTestId('reset-components')).toBeEnabled();

      fireEvent.click(menuButton);
      fireEvent.click(within(moveComponent).getByTestId('move-action'));

      // reset to default
      fireEvent.click(screen.getByTestId('reset-components'));

      await waitFor(() => {
        expect(screen.getByTestId('reset-components')).toBeDisabled();
        const section = screen.getByTestId('selected-component-list');
        expect(within(section).getByTestId('component-test:childA')).toBeInTheDocument();
        expect(within(section).getByTestId('component-test:childB')).toBeInTheDocument();
        expect(within(section).getByTestId('component-test:childC')).toBeInTheDocument();
      });
    });
  });

  describe('modals', () => {
    it('shows a modal when changing profiles with unsaved changes', async () => {
      fireEvent.click(screen.getAllByTestId('resource-profile-item')[0]);

      await waitFor(() => {
        expect(screen.getByTestId('profile-settings')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('profile-settings-select-create'));

      await waitFor(() => {
        expect(screen.getByTestId('component-test:childB')).toBeInTheDocument();
      });

      const component = screen.getByTestId('component-test:childB');
      const menuButton = within(component).getByTestId('activate-menu');
      fireEvent.click(menuButton);
      fireEvent.click(within(component).getByTestId('move-action'));

      await waitFor(() => {
        expect(screen.getByTestId('reset-components')).toBeEnabled();
      });

      fireEvent.click(screen.getAllByTestId('resource-profile-item')[1]);

      await waitFor(() => {
        expect(screen.getByTestId('modal-close-profile-settings')).toBeInTheDocument();
      });
    });
  });

  describe('responsive display', () => {
    const setViewport = (width: number) => {
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: width });
      act(() => {
        window.dispatchEvent(new Event('resize'));
      });
    };

    afterEach(() => {
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: ORIGINAL_INNER_WIDTH });
    });

    it('displays profiles list and settings editor side by side when viewport is wide enough', async () => {
      setViewport(1400);

      await waitFor(() => {
        expect(screen.getByTestId('profiles-list')).not.toHaveClass('hidden');
        expect(screen.getByTestId('profile-settings')).not.toHaveClass('hidden');
      });
    });

    it('displays settings editor only when viewport is resized from wide to narrow', async () => {
      setViewport(1400);

      await waitFor(() => {
        expect(screen.getByTestId('profiles-list')).not.toHaveClass('hidden');
        expect(screen.getByTestId('profile-settings')).not.toHaveClass('hidden');
      });

      setViewport(600);

      await waitFor(() => {
        expect(screen.getByTestId('profiles-list')).toHaveClass('hidden');
        expect(screen.getByTestId('profile-settings')).not.toHaveClass('hidden');
      });
    });

    it('displays only profile settings when viewport is narrow and default profile is chosen', async () => {
      setViewport(600);

      await waitFor(() => {
        expect(screen.getByTestId('profiles-list')).toHaveClass('hidden');
        expect(screen.getByTestId('profile-settings')).not.toHaveClass('hidden');
      });
    });

    it('displays only settings editor after selecting a profile from list when viewport is narrow', async () => {
      setViewport(600);

      fireEvent.click(screen.getAllByTestId('resource-profile-item')[0]);

      await waitFor(() => {
        expect(screen.getByTestId('profiles-list')).toHaveClass('hidden');
        expect(screen.getByTestId('profile-settings')).not.toHaveClass('hidden');
      });
    });

    it('displays only profile list after returning from settings when viewport is narrow', async () => {
      setViewport(600);

      fireEvent.click(screen.getAllByTestId('resource-profile-item')[0]);
      fireEvent.click(screen.getByTestId('back-to-profiles-list'));

      await waitFor(() => {
        expect(screen.getByTestId('profiles-list')).not.toHaveClass('hidden');
        expect(screen.getByTestId('profile-settings')).toHaveClass('hidden');
      });
    });

    it('select, back, and return to settings when viewport is narrow', async () => {
      setViewport(600);

      fireEvent.click(screen.getAllByTestId('resource-profile-item')[0]);
      fireEvent.click(screen.getByTestId('back-to-profiles-list'));
      fireEvent.click(screen.getAllByTestId('resource-profile-item')[0]);

      await waitFor(() => {
        expect(screen.getByTestId('profiles-list')).toHaveClass('hidden');
        expect(screen.getByTestId('profile-settings')).not.toHaveClass('hidden');
      });
    });
  });

  describe('accessibility', () => {
    test('basic render has no accessibility violations', async () => {
      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });

    test('settings render has no accessibility violations', async () => {
      fireEvent.click(screen.getAllByTestId('resource-profile-item')[0]);

      await waitFor(() => {
        expect(screen.getByTestId('profile-settings')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('profile-settings-select-create'));

      await waitFor(() => {
        expect(screen.getByTestId('component-test:childC')).toBeInTheDocument();
      });

      const results = await axe(container, {
        rules: {
          'nested-interactive': { enabled: false },
        },
      });

      expect(results).toHaveNoViolations();
    });
  });
});
