import { SCROLL_BEHAVIOR, SCROLL_OFFSET } from '@common/constants/pageScrolling.constnts';

export const scrollElementIntoView = (elem?: Element | null, navElem?: Element | null) => {
  if (!elem) return;

  const typedElem = elem as HTMLElement;
  const elementPosition = typedElem?.offsetTop || 0;
  const navHeight = navElem?.clientHeight || 0;

  window.scrollTo({
    top: elementPosition - navHeight - SCROLL_OFFSET,
    behavior: SCROLL_BEHAVIOR,
  });
};

export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: SCROLL_BEHAVIOR });
};
