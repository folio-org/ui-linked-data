import { useEffect, useRef, useState } from 'react';
import { GroupBase } from 'react-select';
import Select from 'react-select/dist/declarations/src/Select';
import {
  EDIT_SECTION_CONTAINER_ID,
  CREATABLE_SELECT_OFFSET_PLACEMENT_TRIG,
} from '@common/constants/uiElements.constants';

export const useSimpleLookupObserver = () => {
  const simpleLookupRef = useRef<Select<unknown, boolean, GroupBase<unknown>>>(null);
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
