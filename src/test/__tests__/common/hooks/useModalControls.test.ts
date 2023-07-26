import { act, renderHook } from '@testing-library/react';

const { useModalControls } = jest.requireActual('@common/hooks/useModalControls');

describe('useModalControls', () => {
  test('setIsModalOpen - changes "isModalOpen" value', () => {
    const { result }: any = renderHook(useModalControls);

    expect(result.current.isModalOpen).toBe(false);
    act(() => {
      result.current.setIsModalOpen(true);
    });
    expect(result.current.isModalOpen).toBe(true);
  });
});
