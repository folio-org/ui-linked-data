import { RefObject, useEffect, useState } from 'react';

export const useDismissMenu = (ref: RefObject<HTMLElement | null>) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleFocusOutside = (event: FocusEvent) => {
      if (!event.relatedTarget || (ref.current && !ref.current.contains(event.relatedTarget as Node))) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (ref.current && event.key === 'Escape') {
        setIsOpen(false);
        ref.current.focus();
      }
    };

    document.addEventListener('pointerdown', handleClickOutside);
    document.addEventListener('focusout', handleFocusOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
      document.removeEventListener('focusout', handleFocusOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const toggle = () => {
    setIsOpen(prev => !prev);
  };

  return {
    isOpen,
    setIsOpen,
    toggle,
  };
};
