import { act, renderHook } from '@testing-library/react';

import { ComplexLookupType } from '@/features/complexLookup/constants/complexLookup.constants';

import * as modalRegistry from '../configs/modalRegistry';
import { useComplexLookupField } from './useComplexLookupField';

jest.mock('@/common/services/logger', () => ({
  logger: {
    error: jest.fn(),
  },
}));

describe('useComplexLookupField', () => {
  const mockOnChange = jest.fn();
  const mockUuid = 'test-uuid';

  const defaultParams = {
    value: undefined,
    lookupType: ComplexLookupType.Hub,
    uuid: mockUuid,
    onChange: mockOnChange,
  };

  it('initializes with empty local value when value is undefined', () => {
    const { result } = renderHook(() => useComplexLookupField(defaultParams));

    expect(result.current.localValue).toEqual([]);
    expect(result.current.isModalOpen).toBe(false);
  });

  it('initializes with provided value', () => {
    const value = [{ id: '1', label: 'Test Item', meta: {} }];
    const { result } = renderHook(() => useComplexLookupField({ ...defaultParams, value }));

    expect(result.current.localValue).toEqual(value);
  });

  it('syncs local value when prop value changes', () => {
    const value1 = [{ id: '1', label: 'Item 1', meta: {} }];
    const value2 = [{ id: '2', label: 'Item 2', meta: {} }];

    const { result, rerender } = renderHook(
      ({ value }: { value?: UserValueContents[] }) => useComplexLookupField({ ...defaultParams, value }),
      {
        initialProps: { value: value1 },
      },
    );

    expect(result.current.localValue).toEqual(value1);

    rerender({ value: value2 });
    expect(result.current.localValue).toEqual(value2);
  });

  it('opens and close modal', () => {
    const { result } = renderHook(() => useComplexLookupField(defaultParams));

    expect(result.current.isModalOpen).toBe(false);

    act(() => {
      result.current.handleOpenModal();
    });

    expect(result.current.isModalOpen).toBe(true);

    act(() => {
      result.current.handleCloseModal();
    });

    expect(result.current.isModalOpen).toBe(false);
  });

  it('handles assign action correctly', () => {
    const { result } = renderHook(() => useComplexLookupField(defaultParams));

    const mockRecord = { id: 'new-id', title: 'New Title' };

    act(() => {
      result.current.handleOpenModal();
    });

    expect(result.current.isModalOpen).toBe(true);

    act(() => {
      result.current.handleAssign(mockRecord);
    });

    expect(result.current.localValue).toEqual([
      {
        id: 'new-id',
        label: 'New Title',
        meta: {
          type: 'complex',
          uri: undefined,
        },
      },
    ]);
    expect(mockOnChange).toHaveBeenCalledWith(mockUuid, [
      {
        id: 'new-id',
        label: 'New Title',
        meta: {
          type: 'complex',
          uri: undefined,
        },
      },
    ]);
    expect(result.current.isModalOpen).toBe(false);
  });

  it('handles delete action correctly', () => {
    const value = [{ id: '1', label: 'Item 1', meta: {} }];

    const { result } = renderHook(() => useComplexLookupField({ ...defaultParams, value }));

    act(() => {
      result.current.handleDelete('1');
    });

    expect(result.current.localValue).toEqual([]);
    expect(mockOnChange).toHaveBeenCalledWith(mockUuid, []);
  });

  it('does not delete when id is undefined', () => {
    const value = [{ id: '1', label: 'Item 1', meta: {} }];
    const { result } = renderHook(() => useComplexLookupField({ ...defaultParams, value }));

    act(() => {
      result.current.handleDelete(undefined);
    });

    expect(result.current.localValue).toEqual(value);
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('gets modal config from registry', () => {
    const mockConfig = {
      component: jest.fn(),
      defaultProps: {},
      labels: {
        button: {
          base: 'ld.add',
          change: 'ld.change',
        },
      },
      assignmentFlow: 'simple' as const,
      lookupConfigKey: ComplexLookupType.Hub,
    };

    jest.spyOn(modalRegistry, 'getModalConfig').mockReturnValue(mockConfig);

    const { result } = renderHook(() => useComplexLookupField(defaultParams));

    expect(result.current.modalConfig).toEqual(mockConfig);
    expect(modalRegistry.getModalConfig).toHaveBeenCalledWith(ComplexLookupType.Hub);
  });

  it('returns null modal config when lookupType is undefined', () => {
    const { result } = renderHook(() => useComplexLookupField({ ...defaultParams, lookupType: undefined }));

    expect(result.current.modalConfig).toBeNull();
  });

  it('returns correct button label', () => {
    jest.spyOn(modalRegistry, 'getButtonLabel').mockReturnValue('ld.add');

    const { result } = renderHook(() => useComplexLookupField(defaultParams));

    expect(result.current.buttonLabelId).toBe('ld.add');
  });

  it('updates button label when value changes', () => {
    const getButtonLabelSpy = jest.spyOn(modalRegistry, 'getButtonLabel');
    getButtonLabelSpy.mockReturnValue('ld.add');

    const { result, rerender } = renderHook(
      ({ value }: { value?: UserValueContents[] }) => useComplexLookupField({ ...defaultParams, value }),
      {
        initialProps: { value: undefined as UserValueContents[] | undefined },
      },
    );

    expect(result.current.buttonLabelId).toBe('ld.add');
    expect(getButtonLabelSpy).toHaveBeenCalledWith(ComplexLookupType.Hub, false);

    getButtonLabelSpy.mockReturnValue('ld.change');

    const newValue: UserValueContents[] = [{ id: '1', label: 'Test', meta: {} }];
    rerender({ value: newValue });

    expect(result.current.buttonLabelId).toBe('ld.change');
  });
});
