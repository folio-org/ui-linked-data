import { setInitialGlobalState } from '@/test/__mocks__/store';

import { renderHook, waitFor } from '@testing-library/react';

import { ModalConfig } from '@/features/complexLookup/configs/modalRegistry';

import { useMarcPreviewState, useUIState } from '@/store';

import * as useAuthoritiesAssignmentModule from './useAuthoritiesAssignment';
import * as useAuthoritiesMarcPreviewModule from './useAuthoritiesMarcPreview';
import { useAuthoritiesModalLogic } from './useAuthoritiesModalLogic';
import * as useAuthoritiesSegmentDataModule from './useAuthoritiesSegmentData';

jest.mock('./useAuthoritiesAssignment');
jest.mock('./useAuthoritiesMarcPreview');
jest.mock('./useAuthoritiesSegmentData');

describe('useAuthoritiesModalLogic', () => {
  const mockOnAssign = jest.fn();
  const mockOnClose = jest.fn();
  const mockSetIsMarcPreviewOpen = jest.fn();
  const mockResetComplexValue = jest.fn();
  const mockResetMetadata = jest.fn();
  const mockLoadMarcData = jest.fn();
  const mockResetPreview = jest.fn();
  const mockOnSegmentEnter = jest.fn();
  const mockHandleAssign = jest.fn();
  const mockCheckFailedId = jest.fn();

  const mockEntry: SchemaEntry = { uuid: 'entry_1' } as SchemaEntry;
  const mockLookupContext = 'test-context';
  const mockModalConfig = {
    type: 'authorities',
    api: {
      endpoints: {
        marcPreview: '/marc-preview',
        source: '/source',
        facets: '/facets',
      },
    },
  } as unknown as ModalConfig;

  beforeEach(() => {
    setInitialGlobalState([
      {
        store: useUIState,
        state: {
          isMarcPreviewOpen: false,
          setIsMarcPreviewOpen: mockSetIsMarcPreviewOpen,
        },
      },
      {
        store: useMarcPreviewState,
        state: {
          resetComplexValue: mockResetComplexValue,
          resetMetadata: mockResetMetadata,
        },
      },
    ]);

    (useAuthoritiesMarcPreviewModule.useAuthoritiesMarcPreview as jest.Mock).mockReturnValue({
      loadMarcData: mockLoadMarcData,
      resetPreview: mockResetPreview,
      isLoading: false,
    });

    (useAuthoritiesSegmentDataModule.useAuthoritiesSegmentData as jest.Mock).mockReturnValue({
      onSegmentEnter: mockOnSegmentEnter,
    });

    (useAuthoritiesAssignmentModule.useAuthoritiesAssignment as jest.Mock).mockReturnValue({
      handleAssign: mockHandleAssign,
      checkFailedId: mockCheckFailedId,
    });
  });

  describe('Hook initialization', () => {
    it('returns all expected properties', () => {
      const { result } = renderHook(() =>
        useAuthoritiesModalLogic({
          entry: mockEntry,
          lookupContext: mockLookupContext,
          modalConfig: mockModalConfig,
          onAssign: mockOnAssign,
          onClose: mockOnClose,
          isOpen: true,
        }),
      );

      expect(result.current).toHaveProperty('isMarcPreviewOpen');
      expect(result.current).toHaveProperty('isMarcLoading');
      expect(result.current).toHaveProperty('authoritiesData');
      expect(result.current).toHaveProperty('handleTitleClick');
      expect(result.current).toHaveProperty('handleAuthoritiesAssign');
      expect(result.current).toHaveProperty('handleCloseMarcPreview');
      expect(result.current).toHaveProperty('handleResetMarcPreview');
      expect(result.current).toHaveProperty('checkFailedId');
      expect(result.current).toHaveProperty('cleanup');
    });

    it('gets MARC preview state from useUIState', () => {
      const { result } = renderHook(() =>
        useAuthoritiesModalLogic({
          onAssign: mockOnAssign,
          onClose: mockOnClose,
          isOpen: true,
        }),
      );

      expect(result.current.isMarcPreviewOpen).toBe(false);
    });

    it('returns MARC loading state from useAuthoritiesMarcPreview', () => {
      const { result } = renderHook(() =>
        useAuthoritiesModalLogic({
          onAssign: mockOnAssign,
          onClose: mockOnClose,
          isOpen: true,
        }),
      );

      expect(result.current.isMarcLoading).toBe(false);
    });
  });

  describe('useAuthoritiesSegmentData integration', () => {
    it('calls useAuthoritiesSegmentData with correct parameters when modalConfig provided', () => {
      renderHook(() =>
        useAuthoritiesModalLogic({
          entry: mockEntry,
          lookupContext: mockLookupContext,
          modalConfig: mockModalConfig,
          onAssign: mockOnAssign,
          onClose: mockOnClose,
          isOpen: true,
        }),
      );

      expect(useAuthoritiesSegmentDataModule.useAuthoritiesSegmentData).toHaveBeenCalledWith({
        sourceEndpoint: '/source',
        facetsEndpoint: '/facets',
        facet: 'sourceFileId',
        autoLoadOnMount: true,
        isOpen: true,
      });
    });

    it('calls useAuthoritiesSegmentData with undefined endpoints when modalConfig not provided', () => {
      renderHook(() =>
        useAuthoritiesModalLogic({
          onAssign: mockOnAssign,
          onClose: mockOnClose,
          isOpen: true,
        }),
      );

      expect(useAuthoritiesSegmentDataModule.useAuthoritiesSegmentData).toHaveBeenCalledWith({
        sourceEndpoint: undefined,
        facetsEndpoint: undefined,
        facet: 'sourceFileId',
        autoLoadOnMount: true,
        isOpen: true,
      });
    });

    it('returns authoritiesData with onSegmentEnter callback', () => {
      const { result } = renderHook(() =>
        useAuthoritiesModalLogic({
          onAssign: mockOnAssign,
          onClose: mockOnClose,
          isOpen: true,
        }),
      );

      expect(result.current.authoritiesData.onSegmentEnter).toBe(mockOnSegmentEnter);
    });
  });

  describe('useAuthoritiesMarcPreview integration', () => {
    it('calls useAuthoritiesMarcPreview with correct parameters', () => {
      setInitialGlobalState([
        {
          store: useUIState,
          state: {
            isMarcPreviewOpen: true,
            setIsMarcPreviewOpen: mockSetIsMarcPreviewOpen,
          },
        },
      ]);

      renderHook(() =>
        useAuthoritiesModalLogic({
          entry: mockEntry,
          lookupContext: mockLookupContext,
          modalConfig: mockModalConfig,
          onAssign: mockOnAssign,
          onClose: mockOnClose,
          isOpen: true,
        }),
      );

      expect(useAuthoritiesMarcPreviewModule.useAuthoritiesMarcPreview).toHaveBeenCalledWith({
        endpointUrl: '/marc-preview',
        isMarcPreviewOpen: true,
      });
    });

    it('uses empty string for endpointUrl when modalConfig not provided', () => {
      renderHook(() =>
        useAuthoritiesModalLogic({
          onAssign: mockOnAssign,
          onClose: mockOnClose,
          isOpen: true,
        }),
      );

      expect(useAuthoritiesMarcPreviewModule.useAuthoritiesMarcPreview).toHaveBeenCalledWith({
        endpointUrl: '',
        isMarcPreviewOpen: false,
      });
    });
  });

  describe('handleTitleClick', () => {
    it('calls loadMarcData with provided parameters', () => {
      const { result } = renderHook(() =>
        useAuthoritiesModalLogic({
          onAssign: mockOnAssign,
          onClose: mockOnClose,
          isOpen: true,
        }),
      );

      result.current.handleTitleClick('auth_1', 'Authority 1', 'Personal Name');

      expect(mockLoadMarcData).toHaveBeenCalledWith('auth_1', 'Authority 1', 'Personal Name');
    });

    it('opens MARC preview modal', () => {
      const { result } = renderHook(() =>
        useAuthoritiesModalLogic({
          onAssign: mockOnAssign,
          onClose: mockOnClose,
          isOpen: true,
        }),
      );

      result.current.handleTitleClick('auth_2');

      expect(mockSetIsMarcPreviewOpen).toHaveBeenCalledWith(true);
    });

    it('calls loadMarcData before opening preview', () => {
      const callOrder: string[] = [];
      const trackingLoadMarcData = jest.fn(() => callOrder.push('loadMarcData'));
      const trackingSetIsMarcPreviewOpen = jest.fn(() => callOrder.push('setIsMarcPreviewOpen'));

      (useAuthoritiesMarcPreviewModule.useAuthoritiesMarcPreview as jest.Mock).mockReturnValue({
        loadMarcData: trackingLoadMarcData,
        resetPreview: mockResetPreview,
        isLoading: false,
      });

      setInitialGlobalState([
        {
          store: useUIState,
          state: {
            isMarcPreviewOpen: false,
            setIsMarcPreviewOpen: trackingSetIsMarcPreviewOpen,
          },
        },
      ]);

      const { result } = renderHook(() =>
        useAuthoritiesModalLogic({
          onAssign: mockOnAssign,
          onClose: mockOnClose,
          isOpen: true,
        }),
      );

      result.current.handleTitleClick('auth_3');

      expect(callOrder).toEqual(['loadMarcData', 'setIsMarcPreviewOpen']);
    });
  });

  describe('handleCloseMarcPreview', () => {
    it('resets preview data', () => {
      const { result } = renderHook(() =>
        useAuthoritiesModalLogic({
          onAssign: mockOnAssign,
          onClose: mockOnClose,
          isOpen: true,
        }),
      );

      result.current.handleCloseMarcPreview();

      expect(mockResetPreview).toHaveBeenCalled();
    });

    it('closes MARC preview modal', () => {
      const { result } = renderHook(() =>
        useAuthoritiesModalLogic({
          onAssign: mockOnAssign,
          onClose: mockOnClose,
          isOpen: true,
        }),
      );

      result.current.handleCloseMarcPreview();

      expect(mockSetIsMarcPreviewOpen).toHaveBeenCalledWith(false);
    });

    it('resets preview before closing modal', () => {
      const callOrder: string[] = [];
      const trackingResetPreview = jest.fn(() => callOrder.push('resetPreview'));
      const trackingSetIsMarcPreviewOpen = jest.fn(() => callOrder.push('setIsMarcPreviewOpen'));

      (useAuthoritiesMarcPreviewModule.useAuthoritiesMarcPreview as jest.Mock).mockReturnValue({
        loadMarcData: mockLoadMarcData,
        resetPreview: trackingResetPreview,
        isLoading: false,
      });

      setInitialGlobalState([
        {
          store: useUIState,
          state: {
            isMarcPreviewOpen: false,
            setIsMarcPreviewOpen: trackingSetIsMarcPreviewOpen,
          },
        },
      ]);

      const { result } = renderHook(() =>
        useAuthoritiesModalLogic({
          onAssign: mockOnAssign,
          onClose: mockOnClose,
          isOpen: true,
        }),
      );

      result.current.handleCloseMarcPreview();

      expect(callOrder).toEqual(['resetPreview', 'setIsMarcPreviewOpen']);
    });
  });

  describe('handleResetMarcPreview', () => {
    it('resets preview data', () => {
      const { result } = renderHook(() =>
        useAuthoritiesModalLogic({
          onAssign: mockOnAssign,
          onClose: mockOnClose,
          isOpen: true,
        }),
      );

      result.current.handleResetMarcPreview();

      expect(mockResetPreview).toHaveBeenCalled();
    });

    it('closes MARC preview modal', () => {
      const { result } = renderHook(() =>
        useAuthoritiesModalLogic({
          onAssign: mockOnAssign,
          onClose: mockOnClose,
          isOpen: true,
        }),
      );

      result.current.handleResetMarcPreview();

      expect(mockSetIsMarcPreviewOpen).toHaveBeenCalledWith(false);
    });
  });

  describe('handleAuthoritiesAssign - complex flow', () => {
    it('calls handleAssign from useAuthoritiesAssignment when hasComplexFlow is true', async () => {
      const { result } = renderHook(() =>
        useAuthoritiesModalLogic({
          entry: mockEntry,
          lookupContext: mockLookupContext,
          modalConfig: mockModalConfig,
          onAssign: mockOnAssign,
          onClose: mockOnClose,
          isOpen: true,
        }),
      );

      const testRecord: ComplexLookupAssignRecordDTO = { id: 'auth_1', title: 'Authority 1' };
      await result.current.handleAuthoritiesAssign(testRecord);

      expect(mockHandleAssign).toHaveBeenCalledWith(testRecord);
    });

    it('does not call onAssign directly in complex flow', async () => {
      const { result } = renderHook(() =>
        useAuthoritiesModalLogic({
          entry: mockEntry,
          lookupContext: mockLookupContext,
          modalConfig: mockModalConfig,
          onAssign: mockOnAssign,
          onClose: mockOnClose,
          isOpen: true,
        }),
      );

      const testRecord: ComplexLookupAssignRecordDTO = { id: 'auth_2', title: 'Authority 2' };
      await result.current.handleAuthoritiesAssign(testRecord);

      expect(mockOnAssign).not.toHaveBeenCalled();
    });

    it('calls useAuthoritiesAssignment with correct parameters', () => {
      renderHook(() =>
        useAuthoritiesModalLogic({
          entry: mockEntry,
          lookupContext: mockLookupContext,
          modalConfig: mockModalConfig,
          onAssign: mockOnAssign,
          onClose: mockOnClose,
          isOpen: true,
        }),
      );

      expect(useAuthoritiesAssignmentModule.useAuthoritiesAssignment).toHaveBeenCalledWith({
        entry: mockEntry,
        lookupContext: mockLookupContext,
        modalConfig: mockModalConfig,
        onAssignSuccess: expect.any(Function),
        enabled: true,
      });
    });
  });

  describe('handleAuthoritiesAssign - simple flow', () => {
    it('calls onAssign directly when hasComplexFlow is false', async () => {
      const { result } = renderHook(() =>
        useAuthoritiesModalLogic({
          onAssign: mockOnAssign,
          onClose: mockOnClose,
          isOpen: true,
        }),
      );

      const testRecord: ComplexLookupAssignRecordDTO = { id: 'auth_3', title: 'Authority 3' };
      await result.current.handleAuthoritiesAssign(testRecord);

      await waitFor(() => {
        expect(mockOnAssign).toHaveBeenCalledWith(testRecord);
      });
    });

    it('calls onClose after assignment', async () => {
      const { result } = renderHook(() =>
        useAuthoritiesModalLogic({
          onAssign: mockOnAssign,
          onClose: mockOnClose,
          isOpen: true,
        }),
      );

      const testRecord: ComplexLookupAssignRecordDTO = { id: 'auth_4', title: 'Authority 4' };
      await result.current.handleAuthoritiesAssign(testRecord);

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it('resets preview before assignment', async () => {
      const callOrder: string[] = [];
      const trackingResetPreview = jest.fn(() => callOrder.push('resetPreview'));
      const trackingSetIsMarcPreviewOpen = jest.fn(() => callOrder.push('setIsMarcPreviewOpen'));
      const trackingOnAssign = jest.fn(() => callOrder.push('onAssign'));
      const trackingOnClose = jest.fn(() => callOrder.push('onClose'));

      (useAuthoritiesMarcPreviewModule.useAuthoritiesMarcPreview as jest.Mock).mockReturnValue({
        loadMarcData: mockLoadMarcData,
        resetPreview: trackingResetPreview,
        isLoading: false,
      });

      setInitialGlobalState([
        {
          store: useUIState,
          state: {
            isMarcPreviewOpen: false,
            setIsMarcPreviewOpen: trackingSetIsMarcPreviewOpen,
          },
        },
      ]);

      const { result } = renderHook(() =>
        useAuthoritiesModalLogic({
          onAssign: trackingOnAssign,
          onClose: trackingOnClose,
          isOpen: true,
        }),
      );

      const testRecord: ComplexLookupAssignRecordDTO = { id: 'auth_5', title: 'Authority 5' };
      await result.current.handleAuthoritiesAssign(testRecord);

      await waitFor(() => {
        expect(callOrder).toEqual(['resetPreview', 'setIsMarcPreviewOpen', 'onAssign', 'onClose']);
      });
    });

    it('does not call useAuthoritiesAssignment handleAssign in simple flow', async () => {
      const { result } = renderHook(() =>
        useAuthoritiesModalLogic({
          onAssign: mockOnAssign,
          onClose: mockOnClose,
          isOpen: true,
        }),
      );

      const testRecord: ComplexLookupAssignRecordDTO = { id: 'auth_6', title: 'Authority 6' };
      await result.current.handleAuthoritiesAssign(testRecord);

      expect(mockHandleAssign).not.toHaveBeenCalled();
    });
  });

  describe('checkFailedId', () => {
    it('returns checkFailedId from useAuthoritiesAssignment', () => {
      const { result } = renderHook(() =>
        useAuthoritiesModalLogic({
          entry: mockEntry,
          lookupContext: mockLookupContext,
          modalConfig: mockModalConfig,
          onAssign: mockOnAssign,
          onClose: mockOnClose,
          isOpen: true,
        }),
      );

      expect(result.current.checkFailedId).toBe(mockCheckFailedId);
    });

    it('returns undefined when no complex flow', () => {
      (useAuthoritiesAssignmentModule.useAuthoritiesAssignment as jest.Mock).mockReturnValue({
        handleAssign: mockHandleAssign,
        checkFailedId: undefined,
      });

      const { result } = renderHook(() =>
        useAuthoritiesModalLogic({
          onAssign: mockOnAssign,
          onClose: mockOnClose,
          isOpen: true,
        }),
      );

      expect(result.current.checkFailedId).toBeUndefined();
    });
  });

  describe('cleanup object', () => {
    it('returns cleanup object with all required functions', () => {
      const { result } = renderHook(() =>
        useAuthoritiesModalLogic({
          onAssign: mockOnAssign,
          onClose: mockOnClose,
          isOpen: true,
        }),
      );

      expect(result.current.cleanup).toHaveProperty('setIsMarcPreviewOpen');
      expect(result.current.cleanup).toHaveProperty('resetPreview');
      expect(result.current.cleanup).toHaveProperty('resetMarcPreviewData');
      expect(result.current.cleanup).toHaveProperty('resetMarcPreviewMetadata');
    });

    it('cleanup object contains correct functions from state', () => {
      const { result } = renderHook(() =>
        useAuthoritiesModalLogic({
          onAssign: mockOnAssign,
          onClose: mockOnClose,
          isOpen: true,
        }),
      );

      expect(result.current.cleanup.setIsMarcPreviewOpen).toBe(mockSetIsMarcPreviewOpen);
      expect(result.current.cleanup.resetPreview).toBe(mockResetPreview);
      expect(result.current.cleanup.resetMarcPreviewData).toBe(mockResetComplexValue);
      expect(result.current.cleanup.resetMarcPreviewMetadata).toBe(mockResetMetadata);
    });
  });
});
