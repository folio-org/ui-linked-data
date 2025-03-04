import { getResourceIdFromUri } from '@common/helpers/navigation.helper';

describe('getResourceIdFromUri', () => {
  const originalWindow = { ...window };

  
  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        ...originalWindow.location,
        pathname: '',
      },
    });
  });
  
  afterEach(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalWindow.location,
    });
  });

  test('returns undefined when pathname is empty', () => {
    window.location.pathname = '';

    expect(getResourceIdFromUri()).toBeUndefined();
  });

  test('returns undefined when missing edit segment', () => {
    window.location.pathname = '/resources/123';

    expect(getResourceIdFromUri()).toBeUndefined();
  });

  test('returns resourceId', () => {
    window.location.pathname = '/resources/789/edit/';

    expect(getResourceIdFromUri()).toBe('789');
  });
});
