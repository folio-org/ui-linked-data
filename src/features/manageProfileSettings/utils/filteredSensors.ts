import { KeyboardEvent, PointerEvent } from 'react';

import { KeyboardSensor, PointerSensor } from '@dnd-kit/core';

const filterEvent = (element: HTMLElement | null) => {
  let current = element;
  while (current) {
    if (current.dataset && current.dataset.noDnd) {
      return false;
    }
    current = current.parentElement;
  }
  return true;
};

export class FilteredPointerSensor extends PointerSensor {
  static activators = [
    {
      eventName: 'onPointerDown' as const,
      handler: ({ nativeEvent: event }: PointerEvent) => {
        return filterEvent(event.target as HTMLElement);
      },
    },
  ];
}

export class FilteredKeyboardSensor extends KeyboardSensor {
  static activators = [
    {
      eventName: 'onKeyDown' as const,
      handler: ({ nativeEvent: event }: KeyboardEvent<Element>) => {
        if (event.key === ' ' || event.key === 'Enter') {
          return filterEvent(event.target as HTMLElement);
        }
        return false;
      },
    },
  ];
}
