import { useEffect, useRef, useState } from 'react';
import { type GroupBase, type SelectInstance } from 'react-select';

import {
  CREATABLE_SELECT_OFFSET_PLACEMENT_TRIG,
  EDIT_SECTION_CONTAINER_ID,
} from '@/common/constants/uiElements.constants';

export const useSimpleLookupObserver = () => {
  const simpleLookupRef = useRef<SelectInstance<unknown, boolean, GroupBase<unknown>>>(null);
  const [forceDisplayOptionsAtTheTop, setForceDisplayOptionsAtTheTop] = useState(false);

  const observer = new IntersectionObserver(
    ([entry]) => {
      setForceDisplayOptionsAtTheTop(!entry.isIntersecting && entry?.boundingClientRect?.bottom > window.innerHeight);
    },
    { root: document.getElementById(EDIT_SECTION_CONTAINER_ID), rootMargin: CREATABLE_SELECT_OFFSET_PLACEMENT_TRIG },
  );

  useEffect(() => {
    const elem = simpleLookupRef?.current?.inputRef;

    elem && observer.observe(elem);

    return () => {
      observer.disconnect();
    };
  }, [simpleLookupRef]);

  return { simpleLookupRef, forceDisplayOptionsAtTheTop };
};
