import { renderHook, act } from '@testing-library/react';
import { ChangeEvent } from 'react';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { useComplexLookup } from '@common/hooks/useComplexLookup';
import { useMarcData } from '@common/hooks/useMarcData';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { __MOCK_URI_CHANGE_WHEN_IMPLEMENTING } from '@common/constants/complexLookup.constants';
import {
  generateEmptyValueUuid,
  getLinkedField,
  getUpdatedSelectedEntries,
  updateLinkedFieldValue,
} from '@common/helpers/complexLookup.helper';
import {
  MockServicesProvider,
  selectedEntriesService as mockSelectedEntriesService,
} from '@src/test/__mocks__/providers/ServicesProvider.mock';

jest.mock('recoil');
jest.mock('@common/helpers/complexLookup.helper');
jest.mock('@common/hooks/useMarcData');

describe('useComplexLookup', () => {
  const mockSchema = new Map();
  const mockSelectedEntries = [] as string[];
  const mockSetSelectedEntries = jest.fn();
  const mockClearhMarcData = jest.fn();
  const mockResetRecoilState = jest.fn();

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
      },
    },
  ];
  const mockLookupConfig = {
    api: {
      endpoints: {
        marcPreview: '/testEndpoint',
      },
    },
  } as ComplexLookupsConfigEntry;
  const mockMarcPreviewMetadata = {
    baseId: 'newId',
    marcId: 'newMarcId',
    srsId: 'newSrsId',
    title: 'newTitle',
    headingType: 'headingType',
  };

  const mockOnChange = jest.fn();
  let result: any;

  const getRenderedHook = (entry: SchemaEntry = mockEntry) =>
    renderHook(
      () =>
        useComplexLookup({
          entry,
          value: mockValue,
          lookupConfig: mockLookupConfig,
          onChange: mockOnChange,
        }),
      { wrapper: MockServicesProvider },
    );

  beforeEach(() => {
    (useRecoilValue as jest.Mock).mockReturnValueOnce(mockSchema).mockReturnValueOnce(mockMarcPreviewMetadata);
    (useRecoilState as jest.Mock).mockReturnValue([mockSelectedEntries, mockSetSelectedEntries]);
    (useResetRecoilState as jest.Mock).mockReturnValue(mockResetRecoilState);
    (useMarcData as jest.Mock).mockReturnValue({
      fetchMarcData: jest.fn().mockResolvedValue({ matchedId: 'newSrsId' }),
      clearMarcData: mockClearhMarcData,
    });

    result = getRenderedHook()?.result;
  });

  test('initializes correctly', () => {
    expect(result.current.localValue).toEqual(mockValue);
    expect(result.current.isModalOpen).toBe(false);
  });

  describe('handleDelete', () => {
    test('updates state correctly and does not call "getUpdatedSelectedEntries" and "setSelectedEntries"', () => {
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
      (generateEmptyValueUuid as jest.Mock).mockReturnValue('newId_empty');
      (getUpdatedSelectedEntries as jest.Mock).mockReturnValue(['newId_empty']);

      result = getRenderedHook()?.result;

      act(() => {
        result.current.handleDelete('testId');
      });

      expect(mockOnChange).toHaveBeenCalledWith('testUuid', []);
      expect(result.current.localValue).toEqual([]);

      expect(getUpdatedSelectedEntries).toHaveBeenCalledWith({
        selectedEntriesService: mockSelectedEntriesService,
        selectedEntries: mockSelectedEntries,
        linkedFieldChildren: [],
        newValue: 'newId_empty',
      });
      expect(mockSetSelectedEntries).toHaveBeenCalledWith(['newId_empty']);
    });
  });

  test('closeModal - sets isModalOpen to false', () => {
    act(() => {
      result.current.closeModal();
    });

    expect(result.current.isModalOpen).toBe(false);
  });

  describe('handleAssign', () => {
    const mockAssignRecord = {
      id: 'newId',
      title: 'newTitle',
      linkedFieldValue: 'new-linked-field-value',
    };
    const testEntries = [
      {
        id: 'newId',
        label: 'newTitle',
        meta: {
          srsId: 'newSrsId',
          type: AdvancedFieldType.complex,
        },
      },
    ];

    test('updates state correctly', async () => {
      (getLinkedField as jest.Mock).mockReturnValue(mockLinkedField);
      (updateLinkedFieldValue as jest.Mock).mockReturnValue({ uuid: 'newLinkedFieldId' });
      (getUpdatedSelectedEntries as jest.Mock).mockReturnValue(['newId']);

      result = getRenderedHook()?.result;

      await act(async () => {
        result.current.handleAssign(mockAssignRecord);
      });

      expect(mockOnChange).toHaveBeenCalledWith('testUuid', testEntries);
      expect(result.current.localValue).toEqual(testEntries);

      expect(updateLinkedFieldValue).toHaveBeenCalled();
      expect(getUpdatedSelectedEntries).toHaveBeenCalledWith({
        selectedEntriesService: mockSelectedEntriesService,
        selectedEntries: mockSelectedEntries,
        linkedFieldChildren: [],
        newValue: 'newLinkedFieldId',
      });
      expect(mockSetSelectedEntries).toHaveBeenCalledWith(['newId']);
    });

    test('updates state correctly and does not call "setSelectedEntries"', async () => {
      result = getRenderedHook({
        ...mockEntry,
        linkedEntry: {
          dependent: false,
        },
      } as unknown as SchemaEntry)?.result;

      await act(async () => {
        result.current.handleAssign(mockAssignRecord);
      });

      expect(mockOnChange).toHaveBeenCalledWith('testUuid', testEntries);
      expect(result.current.localValue).toEqual(testEntries);

      expect(updateLinkedFieldValue).not.toHaveBeenCalled();
      expect(getUpdatedSelectedEntries).not.toHaveBeenCalled();
      expect(mockSetSelectedEntries).not.toHaveBeenCalled();
    });
  });

  test('handleOnChangeBase - updates state correctly', () => {
    const mockEvent = {
      target: {
        value: 'newValue',
      },
    };
    const testEntry = {
      label: 'newValue',
      meta: {
        uri: __MOCK_URI_CHANGE_WHEN_IMPLEMENTING,
      },
    };

    act(() => {
      result.current.handleOnChangeBase(mockEvent as ChangeEvent<HTMLInputElement>);
    });

    expect(mockOnChange).toHaveBeenCalledWith('testUuid', [testEntry]);
    expect(result.current.localValue).toEqual([...mockValue, testEntry]);
  });
});
