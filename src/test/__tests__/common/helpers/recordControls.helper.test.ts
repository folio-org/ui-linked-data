import { checkButtonDisabledState } from '@common/helpers/recordControls.helper';

describe('recordControls.helper', () => {
  test('check button disabled state', () => {
    expect(
      checkButtonDisabledState({
        resourceRoutePattern: 'mockResourceRoutePattern',
        isInitiallyLoaded: false,
        isEdited: true,
      }),
    ).toBeTruthy();
  });
});
