import * as Router from 'react-router-dom';

import { renderHook } from '@testing-library/react';

import { useRoutePathPattern } from '@/common/hooks/useRoutePathPattern';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

describe('useRoutePathPattern', () => {
  test('returns a path name', () => {
    const pathName = '/test';
    const routes = ['/uri_1', pathName, '/uri_2'];
    jest.spyOn(Router, 'useLocation').mockReturnValueOnce({ pathname: pathName } as Router.Location);

    const { result }: any = renderHook(() => useRoutePathPattern(routes));

    expect(result.current).toEqual(pathName);
  });

  test('returns undefined', () => {
    const routes = ['/uri_1', '/uri_2'];
    jest.spyOn(Router, 'useLocation').mockReturnValueOnce({ pathname: '/test' } as Router.Location);

    const { result }: any = renderHook(() => useRoutePathPattern(routes));

    expect(result.current).toBeUndefined();
  });
});
