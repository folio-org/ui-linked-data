import { RefObject, act } from 'react';

import { fireEvent, renderHook, waitFor } from '@testing-library/react';

import { useDismissMenu } from '@/common/hooks/useDismissMenu';

describe('useDismissMenu', () => {
  const element = document.createElement('div');
  element.tabIndex = 0;
  const mockMenuRef: RefObject<HTMLElement | null> = { current: element };

  beforeEach(() => {
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('dismisses on escape key', async () => {
    const { result } = renderHook(() => useDismissMenu(mockMenuRef));

    act(() => {
      result.current.setIsOpen(true);
    });

    await waitFor(() => {
      expect(result.current.isOpen).toEqual(true);
    });

    act(() => {
      fireEvent.keyDown(document, { key: 'Escape' });
    });

    await waitFor(() => {
      expect(result.current.isOpen).toEqual(false);
    });
  });

  it('dismisses on outside click', async () => {
    const otherElement = document.createElement('span');
    document.body.appendChild(otherElement);

    const { result } = renderHook(() => useDismissMenu(mockMenuRef));

    act(() => {
      result.current.setIsOpen(true);
    });

    await waitFor(() => {
      expect(result.current.isOpen).toEqual(true);
    });

    act(() => {
      fireEvent.pointerDown(otherElement);
    });

    await waitFor(() => {
      expect(result.current.isOpen).toEqual(false);
    });

    document.body.removeChild(otherElement);
  });

  it('dismisses on blur', async () => {
    const otherElement = document.createElement('span');
    otherElement.tabIndex = 0;
    document.body.appendChild(otherElement);

    const { result } = renderHook(() => useDismissMenu(mockMenuRef));

    act(() => {
      element.focus();
      result.current.setIsOpen(true);
    });

    await waitFor(() => {
      expect(result.current.isOpen).toEqual(true);
    });

    act(() => {
      otherElement.focus();
    });

    await waitFor(() => {
      expect(result.current.isOpen).toEqual(false);
    });

    document.body.removeChild(otherElement);
  });
});
