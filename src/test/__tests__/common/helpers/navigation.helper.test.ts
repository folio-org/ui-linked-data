import { getResourceIdFromUri, generatePageURL } from '@common/helpers/navigation.helper';
import { QueryParams } from '@common/constants/routes.constants';

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

describe('generatePageURL', () => {
  test('returns url without query params when queryParams is empty', () => {
    const url = '/resources/create';
    const queryParams = {} as Record<QueryParams, string>;
    const profileId = '';

    const result = generatePageURL({ url, queryParams, profileId });

    expect(result).toBe(url);
  });

  test('returns url with query params when queryParams has values', () => {
    const url = '/resources/create';
    const queryParams = {
      [QueryParams.Type]: 'book',
      [QueryParams.Ref]: 'reference123',
    } as Record<QueryParams, string>;
    const profileId = '';

    const result = generatePageURL({ url, queryParams, profileId });

    expect(result).toBe(`${url}?type=book&ref=reference123`);
  });

  test('skips empty query param values', () => {
    const url = '/resources/create';
    const queryParams = {
      [QueryParams.Type]: 'book',
      [QueryParams.Ref]: '',
      [QueryParams.CloneOf]: undefined as unknown as string,
    } as Record<QueryParams, string>;
    const profileId = '';

    const result = generatePageURL({ url, queryParams, profileId });

    expect(result).toBe(`${url}?type=book`);
  });

  test('adds profileId when provided', () => {
    const url = '/resources/create';
    const queryParams = {} as Record<QueryParams, string>;
    const profileId = 'profile123';

    const result = generatePageURL({ url, queryParams, profileId });

    expect(result).toBe(`${url}?profileId=profile123`);
  });

  test('combines queryParams and profileId when both provided', () => {
    const url = '/resources/create';
    const queryParams = {
      [QueryParams.Type]: 'book',
    } as Record<QueryParams, string>;
    const profileId = 'profile123';

    const result = generatePageURL({ url, queryParams, profileId });

    expect(result).toBe(`${url}?type=book&profileId=profile123`);
  });

  test('profileId overrides profileId in queryParams if both provided', () => {
    const url = '/resources/create';
    const queryParams = {
      [QueryParams.ProfileId]: 'oldProfile',
      [QueryParams.Type]: 'book',
    } as Record<QueryParams, string>;
    const profileId = 'newProfile';

    const result = generatePageURL({ url, queryParams, profileId });

    expect(result).toBe(`${url}?profileId=newProfile&type=book`);
  });
});
