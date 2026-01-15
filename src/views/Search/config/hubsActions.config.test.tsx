import { DropdownItemType } from '@/common/constants/uiElements.constants';
import { createHubActionsConfig } from './hubsActions.config';

describe('createHubActionsConfig', () => {
  const mockOnClickNewHub = jest.fn();

  test('Creates hub actions configuration with newHub action', () => {
    const config = createHubActionsConfig({
      onClickNewHub: mockOnClickNewHub,
    });

    expect(config).toHaveLength(1);
    expect(config[0].id).toBe('actions');
    expect(config[0].labelId).toBe('ld.actions');
    expect(config[0].data).toHaveLength(1);
  });

  test('Creates newHub action with correct properties', () => {
    const config = createHubActionsConfig({
      onClickNewHub: mockOnClickNewHub,
    });

    const newHubAction = config[0].data[0];

    expect(newHubAction.id).toBe('newHub');
    expect(newHubAction.type).toBe(DropdownItemType.basic);
    expect(newHubAction.labelId).toBe('ld.newHub');
    expect(newHubAction.action).toBe(mockOnClickNewHub);
    expect(newHubAction.icon).toBeDefined();
  });
});
