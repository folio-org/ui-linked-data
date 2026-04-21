import { useEffect } from 'react';

interface UseAutoCloseOnErrorParams {
  isError: boolean;
  isOpen: boolean;
  onClose: VoidFunction;
  enabled?: boolean;
}

/**
 * Hook that automatically closes a panel/modal when an error occurs.
 * Useful for preview panels that should close on fetch/load errors.
 */
export function useAutoCloseOnError({ isError, isOpen, onClose, enabled = true }: UseAutoCloseOnErrorParams): void {
  useEffect(() => {
    if (enabled && isError && isOpen) {
      onClose();
    }
  }, [enabled, isError, isOpen, onClose]);
}
