import { IS_EMBEDDED_MODE } from '@common/constants/build.constants';
import { SCROLL_BEHAVIOR_SMOOTH, SCROLL_OFFSET } from '@common/constants/pageScrolling.constnts';
import { EMBEDDED_MODULE_CONTAINER_ID } from '@common/constants/uiElements.constants';

export const getScrollableEntity = () =>
  IS_EMBEDDED_MODE ? document.getElementById(EMBEDDED_MODULE_CONTAINER_ID) : window;

export const scrollEntity = (options: ScrollToOptions) => getScrollableEntity()?.scrollTo(options);

export const scrollElementIntoView = (elem?: Element | null, navElem?: Element | null) => {
  if (!elem) return;

  const typedElem = elem as HTMLElement;
  const elementPosition = typedElem.offsetTop || 0;
  const navHeight = navElem?.clientHeight || 0;
  const calculatedTop = elementPosition - navHeight - SCROLL_OFFSET;
  const top = calculatedTop > 0 ? calculatedTop : 0;

  scrollEntity({ top, behavior: SCROLL_BEHAVIOR_SMOOTH });
};

export const scrollToTop = () => scrollEntity({ top: 0, behavior: SCROLL_BEHAVIOR_SMOOTH });
