import { renderHook, act } from '@testing-library/react';
import { ChangeEvent } from 'react';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { __MOCK_URI_CHANGE_WHEN_IMPLEMENTING } from '@common/constants/complexLookup.constants';
import {
  generateEmptyValueUuid,
  getLinkedField,
  getUpdatedSelectedEntries,
  updateLinkedFieldValue,
} from '@/features/complexLookup/utils/complexLookup.helper';
import {
  MockServicesProvider,
  selectedEntriesService as mockSelectedEntriesService,
} from '@src/test/__mocks__/providers/ServicesProvider.mock';
import { setInitialGlobalState } from '@src/test/__mocks__/store';
import { useInputsStore, useStatusStore } from '@src/store';
import { useComplexLookup } from './useComplexLookup';
import { useComplexLookupValidation } from './useComplexLookupValidation';
import { useMarcAssignment } from './useMarcAssignment';
import { useMarcValidation } from './useMarcValidation';

jest.mock('@/features/complexLookup/utils/complexLookup.helper');
jest.mock('@/features/complexLookup/hooks/useMarcValidation');
jest.mock('@/features/complexLookup/hooks/useMarcAssignment');
jest.mock('@/features/complexLookup/hooks/useComplexLookupValidation');

describe('useComplexLookup', () => {
  const mockSelectedEntries = [] as string[];
  const mockAddFailedEntryId = jest.fn();
  const mockAddStatusMessagesItem = jest.fn();
  const mockSetSelectedEntries = jest.fn();
  const mockClearFailedEntryIds = jest.fn();
  const mockValidateMarcRecord = jest.fn();
  const mockGetMarcDataForAssignment = jest.fn();

  const mockEntry = {
    uuid: 'testUuid',
    linkedEntry: {
      dependent: true,
    },
  } as unknown as SchemaEntry;
  const mockLinkedField = { uuid: 'testLinkedFieldUuid', children: [] } as unknown as SchemaEntry;

  const mockValue = [
    {
      id: 'testId',
      label: 'testLabel',
      meta: {
        type: AdvancedFieldType.complex,
        srsId: 'testSrsId',
      },
    },
  ] as UserValueContents[];

  const mockLookupConfig = {
    api: {
      endpoints: {
        validation: 'test-validation-endpoint',
        marcPreview: 'test-marc-preview-endpoint',
      },
      validationTarget: {
        creator: 'CreatorOfWork',
      },
    },
  } as unknown as ComplexLookupsConfigEntry;

  const mockOnChange = jest.fn();

  beforeEach(() => {
    setInitialGlobalState([
      {
        store: useInputsStore,
        state: {
          selectedEntries: mockSelectedEntries,
          setSelectedEntries: mockSetSelectedEntries,
        },
      },
      {
        store: useStatusStore,
        state: {
          addStatusMessagesItem: mockAddStatusMessagesItem,
        },
      },
    ]);

    (useMarcValidation as jest.Mock).mockReturnValue({
      validateMarcRecord: mockValidateMarcRecord,
    });

    (useMarcAssignment as jest.Mock).mockReturnValue({
      getMarcDataForAssignment: mockGetMarcDataForAssignment,
    });

    (useComplexLookupValidation as jest.Mock).mockReturnValue({
      addFailedEntryId: mockAddFailedEntryId,
      clearFailedEntryIds: mockClearFailedEntryIds,
    });

    mockValidateMarcRecord.mockResolvedValue({
      validAssignment: true,
    });

    mockGetMarcDataForAssignment.mockResolvedValue({
      srsId: 'newSrsId',
      marcData: { test: 'data' },
    });

    (generateEmptyValueUuid as jest.Mock).mockReturnValue('empty_uuid');
    (getLinkedField as jest.Mock).mockReturnValue(undefined);
    (getUpdatedSelectedEntries as jest.Mock).mockReturnValue(['updated_entries']);
    (updateLinkedFieldValue as jest.Mock).mockReturnValue({ uuid: 'updated_linked_field' });
  });

  const getRenderedHook = (entry = mockEntry, value?: UserValueContents[]) =>
    renderHook(
      () =>
        useComplexLookup({
          entry,
          value,
          lookupConfig: mockLookupConfig,
          authority: 'creator',
          onChange: mockOnChange,
        }),
      {
        wrapper: MockServicesProvider,
      },
    );

  let result: { current: ReturnType<typeof useComplexLookup> };

  test('initializes correctly', () => {
    result = getRenderedHook()?.result;

    expect(result.current.localValue).toEqual([]);
    expect(result.current.isModalOpen).toBe(false);
  });

  test('closeModal - sets isModalOpen to false', () => {
    result = getRenderedHook()?.result;

    act(() => {
      result.current.openModal();
    });

    expect(result.current.isModalOpen).toBe(true);

    act(() => {
      result.current.closeModal();
    });

    expect(result.current.isModalOpen).toBe(false);
    expect(mockClearFailedEntryIds).toHaveBeenCalled();
  });

  test('handleOnChangeBase - updates state correctly', () => {
    result = getRenderedHook()?.result;

    const mockEvent = {
      target: { value: 'test value' },
    } as ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleOnChangeBase(mockEvent);
    });

    const expectedValue = {
      label: 'test value',
      meta: {
        uri: __MOCK_URI_CHANGE_WHEN_IMPLEMENTING,
      },
    };

    expect(mockOnChange).toHaveBeenCalledWith('testUuid', [expectedValue]);
    expect(result.current.localValue).toEqual([expectedValue]);
  });

  describe('handleDelete', () => {
    test('updates state correctly and does not call "getUpdatedSelectedEntries" and "setSelectedEntries"', () => {
      result = getRenderedHook(mockEntry, mockValue)?.result;

      act(() => {
        result.current.handleDelete('testId');
      });

      expect(mockOnChange).toHaveBeenCalledWith('testUuid', []);
      expect(result.current.localValue).toEqual([]);
      expect(getUpdatedSelectedEntries).not.toHaveBeenCalled();
      expect(mockSetSelectedEntries).not.toHaveBeenCalled();
    });

    test('updates state correctly and calls getUpdatedSelectedEntries and setSelectedEntries', () => {
      (getLinkedField as jest.Mock).mockReturnValue(mockLinkedField);

      result = getRenderedHook(mockEntry, mockValue)?.result;

      act(() => {
        result.current.handleDelete('testId');
      });

      expect(mockOnChange).toHaveBeenCalledWith('testUuid', []);
      expect(result.current.localValue).toEqual([]);
      expect(getUpdatedSelectedEntries).toHaveBeenCalledWith({
        selectedEntriesService: mockSelectedEntriesService,
        selectedEntries: mockSelectedEntries,
        linkedFieldChildren: mockLinkedField.children,
        newValue: 'empty_uuid',
      });
      expect(mockSetSelectedEntries).toHaveBeenCalledWith(['updated_entries']);
    });
  });

  describe('handleAssign', () => {
    test('calls handleSimpleAssign when hasSimpleFlow is true', async () => {
      result = getRenderedHook()?.result;

      await act(async () => {
        await result.current.handleAssign(
          {
            id: 'simple_123',
            title: 'Simple Title',
            uri: 'http://example.com/simple',
          },
          true, // hasSimpleFlow
        );
      });

      const expectedValue = {
        id: 'simple_123',
        label: 'Simple Title',
        meta: {
          type: AdvancedFieldType.complex,
          uri: 'http://example.com/simple',
        },
      };

      expect(mockOnChange).toHaveBeenCalledWith('testUuid', [expectedValue]);
      expect(mockGetMarcDataForAssignment).not.toHaveBeenCalled();
    });

    test('calls handleComplexAssign when hasSimpleFlow is false', async () => {
      result = getRenderedHook()?.result;

      await act(async () => {
        await result.current.handleAssign(
          {
            id: 'complex_123',
            title: 'Complex Title',
            linkedFieldValue: 'creator',
          },
          false, // hasSimpleFlow
        );
      });

      expect(mockGetMarcDataForAssignment).toHaveBeenCalledWith('complex_123', {
        complexValue: null,
        marcPreviewMetadata: null,
        marcPreviewEndpoint: 'test-marc-preview-endpoint',
      });
      expect(mockValidateMarcRecord).toHaveBeenCalledWith({ test: 'data' }, mockLookupConfig, 'creator');
    });

    test('defaults to handleComplexAssign when hasSimpleFlow is not provided', async () => {
      result = getRenderedHook()?.result;

      await act(async () => {
        await result.current.handleAssign({
          id: 'complex_123',
          title: 'Complex Title',
          linkedFieldValue: 'creator',
        });
      });

      expect(mockGetMarcDataForAssignment).toHaveBeenCalled();
      expect(mockValidateMarcRecord).toHaveBeenCalled();
    });
  });

  describe('handleComplexAssign', () => {
    beforeEach(() => {
      mockGetMarcDataForAssignment.mockResolvedValue({
        srsId: 'test_srs_id',
        marcData: { some: 'data' },
      });

      mockValidateMarcRecord.mockResolvedValue({
        validAssignment: true,
      });
    });

    test('updates state correctly for valid complex assignment', async () => {
      result = getRenderedHook()?.result;

      await act(async () => {
        await result.current.handleAssign({
          id: 'complex_123',
          title: 'Complex Title',
          linkedFieldValue: 'creator',
        });
      });

      const expectedValue = {
        id: 'complex_123',
        label: 'Complex Title',
        meta: {
          type: AdvancedFieldType.complex,
          srsId: 'test_srs_id',
        },
      };

      expect(mockOnChange).toHaveBeenCalledWith('testUuid', [expectedValue]);
      expect(mockClearFailedEntryIds).toHaveBeenCalled();
    });

    test('handles validation error correctly', async () => {
      mockValidateMarcRecord.mockResolvedValue({
        validAssignment: false,
        invalidAssignmentReason: 'invalid_format',
      });

      result = getRenderedHook()?.result;

      await act(async () => {
        await result.current.handleAssign({
          id: 'complex_123',
          title: 'Complex Title',
          linkedFieldValue: 'creator',
        });
      });

      expect(mockAddFailedEntryId).toHaveBeenCalledWith('complex_123');
      expect(mockAddStatusMessagesItem).toHaveBeenCalled();
    });

    test('handles assignment error correctly', async () => {
      mockGetMarcDataForAssignment.mockRejectedValue(new Error('Network error'));

      result = getRenderedHook()?.result;

      await act(async () => {
        await result.current.handleAssign({
          id: 'complex_123',
          title: 'Complex Title',
          linkedFieldValue: 'creator',
        });
      });

      expect(mockAddFailedEntryId).toHaveBeenCalledWith('complex_123');
      expect(mockAddStatusMessagesItem).toHaveBeenCalled();
    });
  });
});
