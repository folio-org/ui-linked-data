import { renderHook, waitFor } from '@testing-library/react';

import * as useHubAssignmentModule from './useHubAssignment';
import { useHubsModalLogic } from './useHubsModalLogic';

jest.mock('./useHubAssignment');

describe('useHubsModalLogic', () => {
  const mockOnAssign = jest.fn();
  const mockOnClose = jest.fn();
  const mockHandleAssign = jest.fn();

  beforeEach(() => {
    (useHubAssignmentModule.useHubAssignment as jest.Mock).mockReturnValue({
      handleAssign: mockHandleAssign,
      isAssigning: false,
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
});
