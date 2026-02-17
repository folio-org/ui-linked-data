import { renderHook } from '@testing-library/react';

import { useComplexLookupModalCleanup } from './useComplexLookupModalCleanup';

describe('useComplexLookupModalCleanup', () => {
  const mockOnClose = jest.fn();
  const mockSetIsMarcPreviewOpen = jest.fn();
  const mockResetPreview = jest.fn();
  const mockResetMarcPreviewData = jest.fn();
  const mockResetMarcPreviewMetadata = jest.fn();

  describe('Basic cleanup', () => {
    it('returns handleModalClose function', () => {
      const { result } = renderHook(() =>
        useComplexLookupModalCleanup({
          onClose: mockOnClose,
        }),
      );

      expect(result.current.handleModalClose).toBeDefined();
      expect(typeof result.current.handleModalClose).toBe('function');
    });

    it('calls onClose when handleModalClose is invoked without MARC preview cleanup', () => {
      const { result } = renderHook(() =>
        useComplexLookupModalCleanup({
          onClose: mockOnClose,
        }),
      );

      result.current.handleModalClose();

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('MARC preview cleanup', () => {
    const marcPreviewCleanup = {
      setIsMarcPreviewOpen: mockSetIsMarcPreviewOpen,
      resetPreview: mockResetPreview,
      resetMarcPreviewData: mockResetMarcPreviewData,
      resetMarcPreviewMetadata: mockResetMarcPreviewMetadata,
    };

    it('calls all MARC preview cleanup functions when provided', () => {
      const { result } = renderHook(() =>
        useComplexLookupModalCleanup({
          onClose: mockOnClose,
          withMarcPreview: marcPreviewCleanup,
        }),
      );

      result.current.handleModalClose();

      expect(mockSetIsMarcPreviewOpen).toHaveBeenCalledTimes(1);
      expect(mockSetIsMarcPreviewOpen).toHaveBeenCalledWith(false);
      expect(mockResetPreview).toHaveBeenCalledTimes(1);
      expect(mockResetMarcPreviewData).toHaveBeenCalledTimes(1);
      expect(mockResetMarcPreviewMetadata).toHaveBeenCalledTimes(1);
    });

    it('calls onClose after MARC preview cleanup', () => {
      const { result } = renderHook(() =>
        useComplexLookupModalCleanup({
          onClose: mockOnClose,
          withMarcPreview: marcPreviewCleanup,
        }),
      );

      result.current.handleModalClose();

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('executes cleanup operations in correct order', () => {
      const callOrder: string[] = [];
      const trackingSetIsMarcPreviewOpen = jest.fn(() => callOrder.push('setIsMarcPreviewOpen'));
      const trackingResetMarcPreviewData = jest.fn(() => callOrder.push('resetMarcPreviewData'));
      const trackingResetMarcPreviewMetadata = jest.fn(() => callOrder.push('resetMarcPreviewMetadata'));
      const trackingResetPreview = jest.fn(() => callOrder.push('resetPreview'));
      const trackingOnClose = jest.fn(() => callOrder.push('onClose'));

      const { result } = renderHook(() =>
        useComplexLookupModalCleanup({
          onClose: trackingOnClose,
          withMarcPreview: {
            setIsMarcPreviewOpen: trackingSetIsMarcPreviewOpen,
            resetPreview: trackingResetPreview,
            resetMarcPreviewData: trackingResetMarcPreviewData,
            resetMarcPreviewMetadata: trackingResetMarcPreviewMetadata,
          },
        }),
      );

      result.current.handleModalClose();

      expect(callOrder).toEqual([
        'setIsMarcPreviewOpen',
        'resetMarcPreviewData',
        'resetMarcPreviewMetadata',
        'resetPreview',
        'onClose',
      ]);
    });
  });

  describe('Callback stability', () => {
    it('maintains stable handleModalClose reference when dependencies do not change', () => {
      const { result, rerender } = renderHook(() =>
        useComplexLookupModalCleanup({
          onClose: mockOnClose,
        }),
      );

      const firstCallback = result.current.handleModalClose;

      rerender();

      expect(result.current.handleModalClose).toBe(firstCallback);
    });

    it('updates handleModalClose when onClose changes', () => {
      const newOnClose = jest.fn();

      const { result, rerender } = renderHook(
        ({ onClose }) =>
          useComplexLookupModalCleanup({
            onClose,
          }),
        {
          initialProps: { onClose: mockOnClose },
        },
      );

      const firstCallback = result.current.handleModalClose;

      rerender({ onClose: newOnClose });

      expect(result.current.handleModalClose).not.toBe(firstCallback);
    });

    it('updates handleModalClose when withMarcPreview changes', () => {
      const marcPreviewCleanup = {
        setIsMarcPreviewOpen: mockSetIsMarcPreviewOpen,
        resetPreview: mockResetPreview,
        resetMarcPreviewData: mockResetMarcPreviewData,
        resetMarcPreviewMetadata: mockResetMarcPreviewMetadata,
      };

      const newMarcPreviewCleanup = {
        setIsMarcPreviewOpen: jest.fn(),
        resetPreview: jest.fn(),
        resetMarcPreviewData: jest.fn(),
        resetMarcPreviewMetadata: jest.fn(),
      };

      const { result, rerender } = renderHook(
        ({ withMarcPreview }) =>
          useComplexLookupModalCleanup({
            onClose: mockOnClose,
            withMarcPreview,
          }),
        {
          initialProps: { withMarcPreview: marcPreviewCleanup },
        },
      );

      const firstCallback = result.current.handleModalClose;

      rerender({ withMarcPreview: newMarcPreviewCleanup });

      expect(result.current.handleModalClose).not.toBe(firstCallback);
    });
  });
});
