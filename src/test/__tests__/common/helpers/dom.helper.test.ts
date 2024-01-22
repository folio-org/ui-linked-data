import { getWrapperAsWebComponent } from '@common/helpers/dom.helper';

describe('dom.helper', () => {
  test('returns the web component', () => {
    document.body.innerHTML = '<marva-next></marva-next>';

    expect(getWrapperAsWebComponent()).toBeTruthy();
  });
});
