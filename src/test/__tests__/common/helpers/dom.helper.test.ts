import { getWrapperAsWebComponent } from '@common/helpers/dom.helper';

jest.mock('@common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: false }));

describe('dom.helper', () => {
  test('returns the web component', () => {
    document.body.innerHTML = '<marva-next></marva-next>';

    expect(getWrapperAsWebComponent()).toBeTruthy();
  });
});
