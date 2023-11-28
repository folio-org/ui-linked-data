import * as PageScrollingHelper from '@common/helpers/pageScrolling.helper';
import * as BuildConstants from '@common/constants/build.constants';
import { getMockedImportedConstant } from '@src/test/__mocks__/common/constants/constants.mock';

jest.mock('@common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: false }));

const getMockedScrollEntity = () => jest.spyOn(PageScrollingHelper, 'scrollEntity').mockImplementation(() => undefined);

describe('pageScrolling.helper', () => {
  const mockIsEmbeddedModeConstant = getMockedImportedConstant(BuildConstants, 'IS_EMBEDDED_MODE');

  describe('getScrollableEntity', () => {
    test('returns window for standalone mode', () => {
      const result = PageScrollingHelper.getScrollableEntity();

      expect(result).toEqual(window);
    });

    test('returns dom element for embedded mode', () => {
      mockIsEmbeddedModeConstant(true);
      const moduleContainer = document.createElement('div');
      moduleContainer.setAttribute('id', 'ModuleContainer');
      document.body.appendChild(moduleContainer);

      const result = PageScrollingHelper.getScrollableEntity();

      expect(result).toEqual(moduleContainer);
    });
  });

  describe('scrollEntity', () => {
    test('calls scrollTo method with passed options', () => {
      jest.spyOn(PageScrollingHelper, 'getScrollableEntity').mockReturnValue(window);
      window.scrollTo = jest.fn();
      const options = { top: 0, behavior: 'smooth' } as ScrollOptions;

      PageScrollingHelper.scrollEntity(options);

      expect(window.scrollTo).toHaveBeenCalledWith(options);
    });
  });

  describe('scrollElementIntoView', () => {
    let spyScrollEntity: jest.SpyInstance<void | undefined, [options: ScrollToOptions], any>;

    beforeEach(() => {
      spyScrollEntity = getMockedScrollEntity();
    });

    test("doesn't call scrollEntity function", () => {
      PageScrollingHelper.scrollElementIntoView();

      expect(spyScrollEntity).not.toHaveBeenCalled();
    });

    test('calls scrollEntity function with calculated top property', () => {
      const elem = document.createElement('div');
      const navElem = document.createElement('div');

      PageScrollingHelper.scrollElementIntoView(elem, navElem);

      expect(spyScrollEntity).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' } as ScrollOptions);
    });
  });

  describe('scrollToTop', () => {
    test('calls scrollEntity function with proper options', () => {
      getMockedScrollEntity();

      PageScrollingHelper.scrollToTop();

      expect(PageScrollingHelper.scrollEntity).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' } as ScrollOptions);
    });
  });
});
