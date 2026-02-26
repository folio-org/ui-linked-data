import { renderHook } from '@testing-library/react';

import * as ComplexLookupHooks from '@/features/complexLookup/hooks';

import { useModalWithHubPreview } from './useModalWithHubPreview';

jest.mock('@/features/complexLookup/hooks/useHubsModalLogic');
jest.mock('@/features/complexLookup/hooks/useComplexLookupModalCleanup');

describe('useModalWithHubPreview', () => {
  const mockOnAssign = jest.fn();
  const mockOnClose = jest.fn();
  const mockWithMarcPreview = {
    setIsMarcPreviewOpen: jest.fn(),
    resetPreview: jest.fn(),
    resetMarcPreviewData: jest.fn(),
    resetMarcPreviewMetadata: jest.fn(),
  };

  const mockHubsLogic = {
    isHubPreviewOpen: false,
    isPreviewLoading: false,
    isPreviewError: false,
    isAssigning: false,
    previewData: null,
    previewMeta: null,
    handleHubTitleClick: jest.fn(),
    handleHubAssign: jest.fn(),
    handleCloseHubPreview: jest.fn(),
    handleResetHubPreview: jest.fn(),
    handleHubPreviewAssign: jest.fn(),
    cleanup: {
      resetIsHubPreviewOpen: jest.fn(),
      resetPreview: jest.fn(),
    },
  };

  const mockHandleModalClose = jest.fn();

  beforeEach(() => {
    (ComplexLookupHooks.useHubsModalLogic as jest.Mock).mockReturnValue(mockHubsLogic);
    (ComplexLookupHooks.useComplexLookupModalCleanup as jest.Mock).mockReturnValue({
      handleModalClose: mockHandleModalClose,
    });
  });

  describe('Integration', () => {
    test('calls useHubsModalLogic with correct parameters', () => {
      renderHook(() =>
        useModalWithHubPreview({
          onAssign: mockOnAssign,
          onClose: mockOnClose,
        }),
      );

      expect(ComplexLookupHooks.useHubsModalLogic).toHaveBeenCalledWith({
        onAssign: mockOnAssign,
        onClose: mockOnClose,
      });
    });

    test('calls useComplexLookupModalCleanup with correct parameters', () => {
      renderHook(() =>
        useModalWithHubPreview({
          onAssign: mockOnAssign,
          onClose: mockOnClose,
        }),
      );

      expect(ComplexLookupHooks.useComplexLookupModalCleanup).toHaveBeenCalledWith({
        onClose: mockOnClose,
        withMarcPreview: undefined,
        withHubPreview: mockHubsLogic.cleanup,
      });
    });

    test('calls useComplexLookupModalCleanup with MARC preview when provided', () => {
      renderHook(() =>
        useModalWithHubPreview({
          onAssign: mockOnAssign,
          onClose: mockOnClose,
          withMarcPreview: mockWithMarcPreview,
        }),
      );

      expect(ComplexLookupHooks.useComplexLookupModalCleanup).toHaveBeenCalledWith({
        onClose: mockOnClose,
        withMarcPreview: mockWithMarcPreview,
        withHubPreview: mockHubsLogic.cleanup,
      });
    });
  });

  describe('Return value', () => {
    test('returns hubPreviewProps with all required properties', () => {
      const { result } = renderHook(() =>
        useModalWithHubPreview({
          onAssign: mockOnAssign,
          onClose: mockOnClose,
        }),
      );

      expect(result.current.hubPreviewProps).toEqual({
        isHubPreviewOpen: mockHubsLogic.isHubPreviewOpen,
        isPreviewLoading: mockHubsLogic.isPreviewLoading,
        isAssigning: mockHubsLogic.isAssigning,
        previewData: mockHubsLogic.previewData,
        previewMeta: mockHubsLogic.previewMeta,
        handleHubTitleClick: mockHubsLogic.handleHubTitleClick,
        handleHubAssign: mockHubsLogic.handleHubAssign,
        handleCloseHubPreview: mockHubsLogic.handleCloseHubPreview,
        handleHubPreviewAssign: mockHubsLogic.handleHubPreviewAssign,
      });
    });

    test('returns handleModalClose from useComplexLookupModalCleanup', () => {
      const { result } = renderHook(() =>
        useModalWithHubPreview({
          onAssign: mockOnAssign,
          onClose: mockOnClose,
        }),
      );

      expect(result.current.handleModalClose).toBe(mockHandleModalClose);
    });

    test('updates when hub logic state changes', () => {
      const { result, rerender } = renderHook(() =>
        useModalWithHubPreview({
          onAssign: mockOnAssign,
          onClose: mockOnClose,
        }),
      );

      expect(result.current.hubPreviewProps.isHubPreviewOpen).toBe(false);

      const updatedHubsLogic = {
        ...mockHubsLogic,
        isHubPreviewOpen: true,
        previewData: { id: 'hub_1', resource: {} },
      };

      (ComplexLookupHooks.useHubsModalLogic as jest.Mock).mockReturnValue(updatedHubsLogic);

      rerender();

      expect(result.current.hubPreviewProps.isHubPreviewOpen).toBe(true);
      expect(result.current.hubPreviewProps.previewData).toEqual({ id: 'hub_1', resource: {} });
    });
  });
});
