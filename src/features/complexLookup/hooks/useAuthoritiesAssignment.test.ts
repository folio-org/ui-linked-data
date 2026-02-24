import { setInitialGlobalState } from '@/test/__mocks__/store';

import { renderHook, waitFor } from '@testing-library/react';

import { LOOKUP_TYPES } from '@/common/constants/lookup.constants';
import { StatusType } from '@/common/constants/status.constants';
import { AdvancedFieldType } from '@/common/constants/uiControls.constants';

import { useInputsStore, useMarcPreviewStore, useProfileStore, useStatusStore } from '@/store';

import { ModalConfig } from '../configs/modalRegistry';
import { useAuthoritiesAssignment } from './useAuthoritiesAssignment';
import { useComplexLookupValidation } from './useComplexLookupValidation';
import { useMarcAssignment } from './useMarcAssignment';
import { useMarcValidation } from './useMarcValidation';

jest.mock('./useMarcValidation');
jest.mock('./useMarcAssignment');
jest.mock('./useComplexLookupValidation');
jest.mock('@/common/hooks/useServicesContext', () => ({
  useServicesContext: () => ({
    selectedEntriesService: {
      get: jest.fn().mockReturnValue(['entry1']),
      set: jest.fn(),
    },
  }),
}));

const delayedResolve = (data: unknown, delay: number) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
};

describe('useAuthoritiesAssignment', () => {
  const mockValidateMarcRecord = jest.fn();
  const mockGetMarcDataForAssignment = jest.fn();
  const mockAddFailedEntryId = jest.fn();
  const mockClearFailedEntryIds = jest.fn();
  const mockCheckFailedId = jest.fn();
  const mockSetSelectedEntries = jest.fn();
  const mockSetMarcPreviewData = jest.fn();
  const mockResetMarcPreviewData = jest.fn();
  const mockResetMarcPreviewMetadata = jest.fn();
  const mockAddStatusMessagesItem = jest.fn();
  const mockOnAssignSuccess = jest.fn();

  const mockEntry: SchemaEntry = {
    uuid: 'test-uuid',
    path: ['test'],
    children: [],
    linkedEntry: {
      dependent: 'dependent-uuid',
    },
  };

  const mockModalConfig = {
    id: 'test-modal',
    component: jest.fn() as unknown as React.ComponentType,
    api: {
      endpoints: {
        marcPreview: '/api/marc-preview',
        validation: '/api/validation',
      },
    },
    linkedField: 'testField',
  } as unknown as ModalConfig;

  const mockSchema = new Map<string, SchemaEntry>([
    [
      'dependent-uuid',
      {
        uuid: 'dependent-uuid',
        path: ['dependent'],
        children: ['child-uuid'],
        uriBFLite: 'testUri',
      } as SchemaEntry,
    ],
    [
      'child-uuid',
      {
        uuid: 'child-uuid',
        path: ['child'],
        children: [],
        type: AdvancedFieldType.dropdownOption,
        uriBFLite: 'testUri',
      } as SchemaEntry,
    ],
  ]);

  beforeEach(() => {
    (useMarcValidation as jest.Mock).mockReturnValue({
      validateMarcRecord: mockValidateMarcRecord,
    });

    (useMarcAssignment as jest.Mock).mockReturnValue({
      getMarcDataForAssignment: mockGetMarcDataForAssignment,
    });

    (useComplexLookupValidation as jest.Mock).mockReturnValue({
      addFailedEntryId: mockAddFailedEntryId,
      clearFailedEntryIds: mockClearFailedEntryIds,
      checkFailedId: mockCheckFailedId,
    });

    setInitialGlobalState([
      {
        store: useProfileStore,
        state: {
          schema: mockSchema,
        },
      },
      {
        store: useInputsStore,
        state: {
          selectedEntries: ['entry1'],
          setSelectedEntries: mockSetSelectedEntries,
        },
      },
      {
        store: useMarcPreviewStore,
        state: {
          complexValue: null,
          metadata: null,
          setComplexValue: mockSetMarcPreviewData,
          resetComplexValue: mockResetMarcPreviewData,
          resetMetadata: mockResetMarcPreviewMetadata,
        },
      },
      {
        store: useStatusStore,
        state: {
          addStatusMessagesItem: mockAddStatusMessagesItem,
        },
      },
    ]);
  });

  it('returns handleAssign function and isAssigning state', () => {
    const { result } = renderHook(() =>
      useAuthoritiesAssignment({
        entry: mockEntry,
        lookupContext: 'test-context',
        modalConfig: mockModalConfig,
        onAssignSuccess: mockOnAssignSuccess,
      }),
    );

    expect(typeof result.current.handleAssign).toBe('function');
    expect(result.current.isAssigning).toBe(false);
    expect(typeof result.current.checkFailedId).toBe('function');
  });

  it('successfully assigns a record with valid data', async () => {
    const mockRecord = {
      id: 'test-id',
      title: 'Test Title',
      linkedFieldValue: 'testValue',
    };

    const mockMarcData = { matchedId: 'srs-id', data: 'test-data' };

    mockGetMarcDataForAssignment.mockResolvedValue({
      srsId: 'srs-id',
      marcData: mockMarcData,
    });

    mockValidateMarcRecord.mockResolvedValue({
      validAssignment: true,
    });

    const { result } = renderHook(() =>
      useAuthoritiesAssignment({
        entry: mockEntry,
        lookupContext: 'test-context',
        modalConfig: mockModalConfig,
        onAssignSuccess: mockOnAssignSuccess,
      }),
    );

    await result.current.handleAssign(mockRecord);

    await waitFor(() => {
      expect(mockOnAssignSuccess).toHaveBeenCalledWith({
        id: 'test-id',
        label: 'Test Title',
        meta: {
          type: AdvancedFieldType.complex,
          lookupType: LOOKUP_TYPES.AUTHORITIES,
          srsId: 'srs-id',
        },
      });
    });

    expect(mockClearFailedEntryIds).toHaveBeenCalled();
    expect(mockResetMarcPreviewData).toHaveBeenCalled();
    expect(mockResetMarcPreviewMetadata).toHaveBeenCalled();
  });

  it('handles validation failure', async () => {
    const mockRecord = {
      id: 'test-id',
      title: 'Test Title',
    };

    mockGetMarcDataForAssignment.mockResolvedValue({
      srsId: 'srs-id',
      marcData: {},
    });

    mockValidateMarcRecord.mockResolvedValue({
      validAssignment: false,
      invalidAssignmentReason: 'MISSING_FIELD',
    });

    const { result } = renderHook(() =>
      useAuthoritiesAssignment({
        entry: mockEntry,
        lookupContext: 'test-context',
        modalConfig: mockModalConfig,
        onAssignSuccess: mockOnAssignSuccess,
      }),
    );

    await result.current.handleAssign(mockRecord);

    await waitFor(() => {
      expect(mockAddFailedEntryId).toHaveBeenCalledWith('test-id');
    });

    expect(mockAddStatusMessagesItem).toHaveBeenCalledWith(
      expect.objectContaining({
        type: StatusType.error,
      }),
    );
    expect(mockOnAssignSuccess).not.toHaveBeenCalled();
  });

  it('handles assignment error', async () => {
    const mockRecord = {
      id: 'test-id',
      title: 'Test Title',
    };

    mockGetMarcDataForAssignment.mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() =>
      useAuthoritiesAssignment({
        entry: mockEntry,
        lookupContext: 'test-context',
        modalConfig: mockModalConfig,
        onAssignSuccess: mockOnAssignSuccess,
      }),
    );

    await result.current.handleAssign(mockRecord);

    await waitFor(() => {
      expect(mockAddFailedEntryId).toHaveBeenCalledWith('test-id');
    });

    expect(mockAddStatusMessagesItem).toHaveBeenCalledWith(
      expect.objectContaining({
        type: StatusType.error,
      }),
    );
    expect(mockOnAssignSuccess).not.toHaveBeenCalled();
  });

  it('does not process assignment when disabled', async () => {
    const mockRecord = {
      id: 'test-id',
      title: 'Test Title',
    };

    const { result } = renderHook(() =>
      useAuthoritiesAssignment({
        entry: mockEntry,
        lookupContext: 'test-context',
        modalConfig: mockModalConfig,
        onAssignSuccess: mockOnAssignSuccess,
        enabled: false,
      }),
    );

    await result.current.handleAssign(mockRecord);

    expect(mockGetMarcDataForAssignment).not.toHaveBeenCalled();
    expect(mockOnAssignSuccess).not.toHaveBeenCalled();
  });

  it('updates isAssigning state during assignment', async () => {
    const mockRecord = {
      id: 'test-id',
      title: 'Test Title',
    };

    mockGetMarcDataForAssignment.mockImplementation(() => delayedResolve({ srsId: 'srs-id', marcData: {} }, 50));

    mockValidateMarcRecord.mockResolvedValue({
      validAssignment: true,
    });

    const { result } = renderHook(() =>
      useAuthoritiesAssignment({
        entry: mockEntry,
        lookupContext: 'test-context',
        modalConfig: mockModalConfig,
        onAssignSuccess: mockOnAssignSuccess,
      }),
    );

    result.current.handleAssign(mockRecord);

    await waitFor(() => {
      expect(result.current.isAssigning).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.isAssigning).toBe(false);
    });
  });
});
