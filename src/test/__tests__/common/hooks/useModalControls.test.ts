import { act, renderHook } from '@testing-library/react';

import { useModalControls } from '@/common/hooks/useModalControls';

describe('useModalControls', () => {
  test('setIsModalOpen - sets "isModalOpen" value', () => {
    const { result }: any = renderHook(useModalControls);

    expect(result.current.isModalOpen).toBe(false);
    act(() => {
      result.current.setIsModalOpen(true);
    });
    expect(result.current.isModalOpen).toBe(true);
    act(() => {
      result.current.setIsModalOpen(false);
    });
    expect(result.current.isModalOpen).toBe(false);
  });

  test('openModal - changes "isModalOpen" value to "true"', () => {
    const { result }: any = renderHook(useModalControls);

    expect(result.current.isModalOpen).toBe(false);
    act(() => {
      result.current.openModal();
    });
    expect(result.current.isModalOpen).toBe(true);
  });
});
