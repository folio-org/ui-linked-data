import { SCROLL_BEHAVIOR, SCROLL_OFFSET } from '@common/constants/pageScrolling.constnts';
import { EMBEDDED_MODULE_CONTAINER_ID } from '@common/constants/uiElements.constants';

export const getScrollableEntity = () =>
  __EMBEDDED_MODE__ ? document.getElementById(EMBEDDED_MODULE_CONTAINER_ID) : window;

export const scrollElementIntoView = (elem?: Element | null, navElem?: Element | null) => {
  if (!elem) return;

  const typedElem = elem as HTMLElement;
  const elementPosition = typedElem?.offsetTop || 0;
  const navHeight = navElem?.clientHeight || 0;
  const top = elementPosition - navHeight - SCROLL_OFFSET || 0;
  const scrollOptions = {
    top,
    behavior: SCROLL_BEHAVIOR,
  } as ScrollToOptions;

  getScrollableEntity()?.scrollTo(scrollOptions);
};

export const scrollToTop = () => {
  getScrollableEntity()?.scrollTo({ top: 0, behavior: SCROLL_BEHAVIOR });
};
