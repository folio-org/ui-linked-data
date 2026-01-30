import { getMockedImportedConstant } from '@/test/__mocks__/common/constants/constants.mock';

import * as BuildConstants from '@/common/constants/build.constants';
import * as PageScrollingHelper from '@/common/helpers/pageScrolling.helper';

jest.mock('@/common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: false }));

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
});
