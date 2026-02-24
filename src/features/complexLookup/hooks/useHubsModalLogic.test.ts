import { setInitialGlobalState } from '@/test/__mocks__/store';

import { renderHook, waitFor } from '@testing-library/react';

import { useUIStore } from '@/store';

import * as useHubAssignmentModule from './useHubAssignment';
import * as useHubPreviewModule from './useHubPreview';
import { useHubsModalLogic } from './useHubsModalLogic';

jest.mock('./useHubAssignment');
jest.mock('./useHubPreview');

describe('useHubsModalLogic', () => {
  const mockOnAssign = jest.fn();
  const mockOnClose = jest.fn();
  const mockHandleAssign = jest.fn();
  const mockLoadHubPreview = jest.fn();
  const mockResetPreview = jest.fn();
  const mockSetIsHubPreviewOpen = jest.fn();
  const mockResetIsHubPreviewOpen = jest.fn();

  beforeEach(() => {
    setInitialGlobalState([
      {
        store: useUIStore,
        state: {
          isHubPreviewOpen: false,
          setIsHubPreviewOpen: mockSetIsHubPreviewOpen,
          resetIsHubPreviewOpen: mockResetIsHubPreviewOpen,
        },
      },
    ]);

    (useHubAssignmentModule.useHubAssignment as jest.Mock).mockReturnValue({
      handleAssign: mockHandleAssign,
      isAssigning: false,
    });

    (useHubPreviewModule.useHubPreview as jest.Mock).mockReturnValue({
      loadHubPreview: mockLoadHubPreview,
      resetPreview: mockResetPreview,
      previewData: null,
      isLoading: false,
      previewMeta: null,
    });
  });

  describe('Hook initialization', () => {
    it('calls useHubAssignment with onAssignSuccess callback', () => {
      renderHook(() =>
        useHubsModalLogic({
          onAssign: mockOnAssign,
          onClose: mockOnClose,
        }),
      );

      expect(useHubAssignmentModule.useHubAssignment).toHaveBeenCalledWith({
        onAssignSuccess: expect.any(Function),
      });
    });

    it('returns handleHubAssign and isAssigning from useHubAssignment', () => {
      const { result } = renderHook(() =>
        useHubsModalLogic({
          onAssign: mockOnAssign,
          onClose: mockOnClose,
        }),
      );

      expect(result.current.handleHubAssign).toBe(mockHandleAssign);
      expect(result.current.isAssigning).toBe(false);
    });
  });

  describe('Assignment flow', () => {
    it('passes handleAssign from useHubAssignment', () => {
      const { result } = renderHook(() =>
        useHubsModalLogic({
          onAssign: mockOnAssign,
          onClose: mockOnClose,
        }),
      );

      expect(result.current.handleHubAssign).toBe(mockHandleAssign);
    });

    it('returns isAssigning state from useHubAssignment', () => {
      (useHubAssignmentModule.useHubAssignment as jest.Mock).mockReturnValue({
        handleAssign: mockHandleAssign,
        isAssigning: true,
      });

      const { result } = renderHook(() =>
        useHubsModalLogic({
          onAssign: mockOnAssign,
          onClose: mockOnClose,
        }),
      );

      expect(result.current.isAssigning).toBe(true);
    });
  });

  describe('onAssignSuccess callback', () => {
    it('calls onAssign with the assigned value', async () => {
      let capturedCallback: ((value: UserValueContents) => void) | undefined;

      (useHubAssignmentModule.useHubAssignment as jest.Mock).mockImplementation(({ onAssignSuccess }) => {
        capturedCallback = onAssignSuccess;
        return {
          handleAssign: mockHandleAssign,
          isAssigning: false,
        };
      });

      renderHook(() =>
        useHubsModalLogic({
          onAssign: mockOnAssign,
          onClose: mockOnClose,
        }),
      );

      const testValue: UserValueContents = { id: 'hub_1', label: 'Hub 1' };
      capturedCallback?.(testValue);

      await waitFor(() => {
        expect(mockOnAssign).toHaveBeenCalledWith(testValue);
      });
    });

    it('calls onClose after successful assignment', async () => {
      let capturedCallback: ((value: UserValueContents) => void) | undefined;

      (useHubAssignmentModule.useHubAssignment as jest.Mock).mockImplementation(({ onAssignSuccess }) => {
        capturedCallback = onAssignSuccess;
        return {
          handleAssign: mockHandleAssign,
          isAssigning: false,
        };
      });

      renderHook(() =>
        useHubsModalLogic({
          onAssign: mockOnAssign,
          onClose: mockOnClose,
        }),
      );

      const testValue: UserValueContents = { id: 'hub_2', label: 'Hub 2' };
      capturedCallback?.(testValue);

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      });
    });

    it('executes onAssign before onClose', async () => {
      const callOrder: string[] = [];
      const trackingOnAssign = jest.fn(() => callOrder.push('onAssign'));
      const trackingOnClose = jest.fn(() => callOrder.push('onClose'));

      let capturedCallback: ((value: UserValueContents) => void) | undefined;

      (useHubAssignmentModule.useHubAssignment as jest.Mock).mockImplementation(({ onAssignSuccess }) => {
        capturedCallback = onAssignSuccess;
        return {
          handleAssign: mockHandleAssign,
          isAssigning: false,
        };
      });

      renderHook(() =>
        useHubsModalLogic({
          onAssign: trackingOnAssign,
          onClose: trackingOnClose,
        }),
      );

      const testValue: UserValueContents = { id: 'hub_3', label: 'Hub 3' };
      capturedCallback?.(testValue);

      await waitFor(() => {
        expect(callOrder).toEqual(['onAssign', 'onClose']);
      });
    });
  });

  describe('Callback stability', () => {
    it('updates onAssignSuccess when onAssign changes', () => {
      const newOnAssign = jest.fn();
      let firstCallback: ((value: UserValueContents) => void) | undefined;
      let secondCallback: ((value: UserValueContents) => void) | undefined;

      (useHubAssignmentModule.useHubAssignment as jest.Mock).mockImplementation(({ onAssignSuccess }) => {
        if (firstCallback === undefined) {
          firstCallback = onAssignSuccess;
        } else {
          secondCallback = onAssignSuccess;
        }

        return {
          handleAssign: mockHandleAssign,
          isAssigning: false,
        };
      });

      const { rerender } = renderHook(
        ({ onAssign, onClose }) =>
          useHubsModalLogic({
            onAssign,
            onClose,
          }),
        {
          initialProps: { onAssign: mockOnAssign, onClose: mockOnClose },
        },
      );

      rerender({ onAssign: newOnAssign, onClose: mockOnClose });

      expect(firstCallback).toBeDefined();
      expect(secondCallback).toBeDefined();
      expect(firstCallback).not.toBe(secondCallback);
    });

    it('updates onAssignSuccess when onClose changes', () => {
      const newOnClose = jest.fn();
      let firstCallback: ((value: UserValueContents) => void) | undefined;
      let secondCallback: ((value: UserValueContents) => void) | undefined;

      (useHubAssignmentModule.useHubAssignment as jest.Mock).mockImplementation(({ onAssignSuccess }) => {
        if (firstCallback === undefined) {
          firstCallback = onAssignSuccess;
        } else {
          secondCallback = onAssignSuccess;
        }

        return {
          handleAssign: mockHandleAssign,
          isAssigning: false,
        };
      });

      const { rerender } = renderHook(
        ({ onAssign, onClose }) =>
          useHubsModalLogic({
            onAssign,
            onClose,
          }),
        {
          initialProps: { onAssign: mockOnAssign, onClose: mockOnClose },
        },
      );

      rerender({ onAssign: mockOnAssign, onClose: newOnClose });

      expect(firstCallback).toBeDefined();
      expect(secondCallback).toBeDefined();
      expect(firstCallback).not.toBe(secondCallback);
    });
  });

  describe('Hub preview handlers', () => {
    it('calls loadHubPreview and setIsHubPreviewOpen when handleHubTitleClick is invoked', () => {
      const { result } = renderHook(() =>
        useHubsModalLogic({
          onAssign: mockOnAssign,
          onClose: mockOnClose,
        }),
      );

      result.current.handleHubTitleClick('hub_1', 'Hub Title');

      expect(mockLoadHubPreview).toHaveBeenCalledWith('hub_1', 'Hub Title');
      expect(mockSetIsHubPreviewOpen).toHaveBeenCalledWith(true);
    });

    it('uses id as title when title is not provided to handleHubTitleClick', () => {
      const { result } = renderHook(() =>
        useHubsModalLogic({
          onAssign: mockOnAssign,
          onClose: mockOnClose,
        }),
      );

      result.current.handleHubTitleClick('hub_2');

      expect(mockLoadHubPreview).toHaveBeenCalledWith('hub_2', 'hub_2');
      expect(mockSetIsHubPreviewOpen).toHaveBeenCalledWith(true);
    });

    it('calls resetPreview and resetIsHubPreviewOpen when handleCloseHubPreview is invoked', () => {
      const { result } = renderHook(() =>
        useHubsModalLogic({
          onAssign: mockOnAssign,
          onClose: mockOnClose,
        }),
      );

      result.current.handleCloseHubPreview();

      expect(mockResetPreview).toHaveBeenCalled();
      expect(mockResetIsHubPreviewOpen).toHaveBeenCalled();
    });

    it('calls resetPreview and resetIsHubPreviewOpen when handleResetHubPreview is invoked', () => {
      const { result } = renderHook(() =>
        useHubsModalLogic({
          onAssign: mockOnAssign,
          onClose: mockOnClose,
        }),
      );

      result.current.handleResetHubPreview();

      expect(mockResetPreview).toHaveBeenCalled();
      expect(mockResetIsHubPreviewOpen).toHaveBeenCalled();
    });

    it('calls handleAssign when handleHubPreviewAssign is invoked', async () => {
      const { result } = renderHook(() =>
        useHubsModalLogic({
          onAssign: mockOnAssign,
          onClose: mockOnClose,
        }),
      );

      const record: ComplexLookupAssignRecordDTO = { id: 'hub_3', title: 'Hub 3' };
      await result.current.handleHubPreviewAssign(record);

      expect(mockHandleAssign).toHaveBeenCalledWith(record);
    });
  });

  describe('Preview state', () => {
    it('returns preview state from useHubPreview', () => {
      const mockPreviewData = {
        id: 'hub_1',
        resource: {
          base: {} as Schema,
          userValues: {} as UserValues,
          initKey: 'key_1',
        },
      };
      const mockPreviewMeta = { id: 'hub_1', title: 'Hub 1' };

      (useHubPreviewModule.useHubPreview as jest.Mock).mockReturnValue({
        loadHubPreview: mockLoadHubPreview,
        resetPreview: mockResetPreview,
        previewData: mockPreviewData,
        isLoading: true,
        previewMeta: mockPreviewMeta,
      });

      const { result } = renderHook(() =>
        useHubsModalLogic({
          onAssign: mockOnAssign,
          onClose: mockOnClose,
        }),
      );

      expect(result.current.previewData).toBe(mockPreviewData);
      expect(result.current.isPreviewLoading).toBe(true);
      expect(result.current.previewMeta).toBe(mockPreviewMeta);
    });

    it('returns isHubPreviewOpen state from UI store', () => {
      setInitialGlobalState([
        {
          store: useUIStore,
          state: {
            isHubPreviewOpen: true,
            setIsHubPreviewOpen: mockSetIsHubPreviewOpen,
            resetIsHubPreviewOpen: mockResetIsHubPreviewOpen,
          },
        },
      ]);

      const { result } = renderHook(() =>
        useHubsModalLogic({
          onAssign: mockOnAssign,
          onClose: mockOnClose,
        }),
      );

      expect(result.current.isHubPreviewOpen).toBe(true);
    });
  });

  describe('Cleanup object', () => {
    it('returns cleanup object with resetIsHubPreviewOpen and resetPreview', () => {
      const { result } = renderHook(() =>
        useHubsModalLogic({
          onAssign: mockOnAssign,
          onClose: mockOnClose,
        }),
      );

      expect(result.current.cleanup).toEqual({
        resetIsHubPreviewOpen: mockResetIsHubPreviewOpen,
        resetPreview: mockResetPreview,
      });
    });
  });
});
