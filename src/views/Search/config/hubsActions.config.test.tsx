import { DropdownItemType } from '@/common/constants/uiElements.constants';

import { createHubActionsConfig } from './hubsActions.config';

describe('createHubActionsConfig', () => {
  const mockOnClickNewHub = jest.fn();
  const mockHandleImportHubs = jest.fn();
  const mockNavigateToManageProfileSettings = jest.fn();

  test('Creates hub actions configuration with newHub action', () => {
    const config = createHubActionsConfig({
      onClickNewHub: mockOnClickNewHub,
      handleImportHubs: mockHandleImportHubs,
      navigateToManageProfileSettings: mockNavigateToManageProfileSettings,
    });

    expect(config).toHaveLength(1);
    expect(config[0].id).toBe('actions');
    expect(config[0].labelId).toBe('ld.actions');
    expect(config[0].data).toHaveLength(3);
  });

  test('Creates newHub action with correct properties', () => {
    const config = createHubActionsConfig({
      onClickNewHub: mockOnClickNewHub,
      handleImportHubs: mockHandleImportHubs,
      navigateToManageProfileSettings: mockNavigateToManageProfileSettings,
    });

    const newHubAction = config[0].data[0];

    expect(newHubAction.id).toBe('newHub');
    expect(newHubAction.type).toBe(DropdownItemType.basic);
    expect(newHubAction.labelId).toBe('ld.newHub');
    expect(newHubAction.action).toBe(mockOnClickNewHub);
    expect(newHubAction.icon).toBeDefined();
  });

  test('Creates importHub action with correct properties', () => {
    const config = createHubActionsConfig({
      onClickNewHub: mockOnClickNewHub,
      handleImportHubs: mockHandleImportHubs,
      navigateToManageProfileSettings: mockNavigateToManageProfileSettings,
    });

    const importHubAction = config[0].data[1];

    expect(importHubAction.id).toBe('importHub');
    expect(importHubAction.type).toBe(DropdownItemType.basic);
    expect(importHubAction.labelId).toBe('ld.importHubs');
    expect(importHubAction.action).toBe(mockHandleImportHubs);
    expect(importHubAction.icon).toBeDefined();
  });

  test('Creates manageProfileSettings action with correct properties', () => {
    const config = createHubActionsConfig({
      onClickNewHub: mockOnClickNewHub,
      handleImportHubs: mockHandleImportHubs,
      navigateToManageProfileSettings: mockNavigateToManageProfileSettings,
    });

    const manageProfileSettingsAction = config[0].data[2];

    expect(manageProfileSettingsAction.id).toBe('manageProfileSettings');
    expect(manageProfileSettingsAction.type).toBe(DropdownItemType.basic);
    expect(manageProfileSettingsAction.labelId).toBe('ld.manageProfileSettings');
    expect(manageProfileSettingsAction.action).toBe(mockNavigateToManageProfileSettings);
    expect(manageProfileSettingsAction.icon).toBeDefined();
  });
});
