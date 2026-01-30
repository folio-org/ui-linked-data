import { MIN_AMT_OF_INSTANCES_TO_COMPARE } from '@/common/constants/search.constants';
import { DropdownItemType } from '@/common/constants/uiElements.constants';

import { createResourceActionsConfig } from './resourcesActions.config';

describe('createResourceActionsConfig', () => {
  const mockOnClickNewWork = jest.fn();
  const mockHandlePreviewMultiple = jest.fn();
  const mockHandleImport = jest.fn();
  const mockNavigateToManageProfileSettings = jest.fn();

  test('Creates resource actions configuration with all actions', () => {
    const config = createResourceActionsConfig({
      onClickNewWork: mockOnClickNewWork,
      handlePreviewMultiple: mockHandlePreviewMultiple,
      handleImport: mockHandleImport,
      navigateToManageProfileSettings: mockNavigateToManageProfileSettings,
      selectedInstancesCount: 3,
    });

    expect(config).toHaveLength(1);
    expect(config[0].id).toBe('actions');
    expect(config[0].labelId).toBe('ld.actions');
    expect(config[0].data).toHaveLength(4);
  });

  test('Creates newResource action with correct properties', () => {
    const config = createResourceActionsConfig({
      onClickNewWork: mockOnClickNewWork,
      handlePreviewMultiple: mockHandlePreviewMultiple,
      handleImport: mockHandleImport,
      navigateToManageProfileSettings: mockNavigateToManageProfileSettings,
      selectedInstancesCount: 3,
    });

    const newResourceAction = config[0].data[0];

    expect(newResourceAction.id).toBe('newResource');
    expect(newResourceAction.type).toBe(DropdownItemType.basic);
    expect(newResourceAction.labelId).toBe('ld.newResource');
    expect(newResourceAction.action).toBe(mockOnClickNewWork);
    expect(newResourceAction.icon).toBeDefined();
  });

  test('Creates compare action with correct properties', () => {
    const config = createResourceActionsConfig({
      onClickNewWork: mockOnClickNewWork,
      handlePreviewMultiple: mockHandlePreviewMultiple,
      handleImport: mockHandleImport,
      navigateToManageProfileSettings: mockNavigateToManageProfileSettings,
      selectedInstancesCount: 3,
    });

    const compareAction = config[0].data[1];

    expect(compareAction.id).toBe('compare');
    expect(compareAction.type).toBe(DropdownItemType.basic);
    expect(compareAction.labelId).toBe('ld.compareSelected');
    expect(compareAction.action).toBe(mockHandlePreviewMultiple);
    expect(compareAction.icon).toBeDefined();
    expect(compareAction.hidden).toBe(false);
  });

  test('Hides compare action when instance count is below minimum', () => {
    const config = createResourceActionsConfig({
      onClickNewWork: mockOnClickNewWork,
      handlePreviewMultiple: mockHandlePreviewMultiple,
      handleImport: mockHandleImport,
      navigateToManageProfileSettings: mockNavigateToManageProfileSettings,
      selectedInstancesCount: MIN_AMT_OF_INSTANCES_TO_COMPARE - 1,
    });

    const compareAction = config[0].data[1];

    expect(compareAction.hidden).toBe(true);
  });

  test('Shows compare action when instance count equals minimum', () => {
    const config = createResourceActionsConfig({
      onClickNewWork: mockOnClickNewWork,
      handlePreviewMultiple: mockHandlePreviewMultiple,
      handleImport: mockHandleImport,
      navigateToManageProfileSettings: mockNavigateToManageProfileSettings,
      selectedInstancesCount: MIN_AMT_OF_INSTANCES_TO_COMPARE,
    });

    const compareAction = config[0].data[1];

    expect(compareAction.hidden).toBe(false);
  });

  test('Creates import action with correct properties', () => {
    const config = createResourceActionsConfig({
      onClickNewWork: mockOnClickNewWork,
      handlePreviewMultiple: mockHandlePreviewMultiple,
      handleImport: mockHandleImport,
      navigateToManageProfileSettings: mockNavigateToManageProfileSettings,
      selectedInstancesCount: 3,
    });

    const importAction = config[0].data[2];

    expect(importAction.id).toBe('import');
    expect(importAction.type).toBe(DropdownItemType.basic);
    expect(importAction.labelId).toBe('ld.importInstances');
    expect(importAction.action).toBe(mockHandleImport);
    expect(importAction.icon).toBeDefined();
  });

  test('Creates manage profile settings action with correct properties', () => {
    const config = createResourceActionsConfig({
      onClickNewWork: mockOnClickNewWork,
      handlePreviewMultiple: mockHandlePreviewMultiple,
      handleImport: mockHandleImport,
      navigateToManageProfileSettings: mockNavigateToManageProfileSettings,
      selectedInstancesCount: 3,
    });

    const manageProfileSettingsAction = config[0].data[3];

    expect(manageProfileSettingsAction.id).toBe('manageProfileSettings');
    expect(manageProfileSettingsAction.type).toBe(DropdownItemType.basic);
    expect(manageProfileSettingsAction.labelId).toBe('ld.manageProfileSettings');
    expect(manageProfileSettingsAction.action).toBe(mockNavigateToManageProfileSettings);
    expect(manageProfileSettingsAction.icon).toBeDefined();
  });
});
