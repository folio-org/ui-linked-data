import { setInitialGlobalState } from '@/test/__mocks__/store';

import { act, renderHook } from '@testing-library/react';

import { getRecordProfileId } from '@/common/helpers/record.helper';
import { useProfileSelectionState } from '@/common/hooks/useProfileSelectionState';

import { useInputsState } from '@/store';

jest.mock('@/common/helpers/record.helper', () => ({
  getRecordProfileId: jest.fn(),
}));

describe('useProfileSelectionState', () => {
  const mockRecord = { id: 'test-record-id', profile: { id: 'test-profile-id' } };

  beforeEach(() => {
    setInitialGlobalState([
      {
        store: useInputsState,
        state: {
          record: mockRecord,
        },
      },
    ]);
  });

  test('initializes with null selectedProfileId', () => {
    const { result } = renderHook(() => useProfileSelectionState({ isModalOpen: false, action: 'select' }));

    expect(result.current.selectedProfileId).toBeNull();
  });

  test('does not update selectedProfileId when modal is closed', () => {
    const { result } = renderHook(() => useProfileSelectionState({ isModalOpen: false, action: 'select' }));

    expect(result.current.selectedProfileId).toBeNull();
    expect(getRecordProfileId).not.toHaveBeenCalled();
  });

  test('sets selectedProfileId to null when modal opens with "select" action', () => {
    const { result } = renderHook(() => useProfileSelectionState({ isModalOpen: true, action: 'select' }));

    expect(result.current.selectedProfileId).toBeNull();
    expect(getRecordProfileId).not.toHaveBeenCalled();
  });

  test('sets selectedProfileId to current profile ID when modal opens with "change" action', () => {
    const expectedProfileId = 'current-profile-id';
    (getRecordProfileId as jest.Mock).mockReturnValue(expectedProfileId);

    const { result } = renderHook(() => useProfileSelectionState({ isModalOpen: true, action: 'change' }));

    expect(getRecordProfileId).toHaveBeenCalledWith(mockRecord);
    expect(result.current.selectedProfileId).toBe(expectedProfileId);
  });

  test('updates selectedProfileId when record changes while modal is open', () => {
    const initialProfileId = 'initial-profile-id';
    const updatedProfileId = 'updated-profile-id';

    (getRecordProfileId as jest.Mock).mockReturnValueOnce(initialProfileId);

    const { result, rerender } = renderHook(props => useProfileSelectionState(props), {
      initialProps: { isModalOpen: true, action: 'change' },
    });

    expect(result.current.selectedProfileId).toBe(initialProfileId);

    // Mock updated record with new profile ID
    const updatedRecord = { ...mockRecord, profile: { id: updatedProfileId } };
    setInitialGlobalState([
      {
        store: useInputsState,
        state: {
          record: updatedRecord,
        },
      },
    ]);

    (getRecordProfileId as jest.Mock).mockReturnValueOnce(updatedProfileId);

    // Rerender with the same props to trigger the effect due to record change
    rerender({ isModalOpen: true, action: 'change' });

    expect(getRecordProfileId).toHaveBeenCalledWith(updatedRecord);
    expect(result.current.selectedProfileId).toBe(updatedProfileId);
  });

  test('updates selectedProfileId when action changes while modal is open', () => {
    const expectedProfileId = 'profile-id';
    (getRecordProfileId as jest.Mock).mockReturnValue(expectedProfileId);

    const { result, rerender } = renderHook(props => useProfileSelectionState(props), {
      initialProps: { isModalOpen: true, action: 'select' },
    });

    // Initially with 'select' action, the selectedProfileId should be null
    expect(result.current.selectedProfileId).toBeNull();

    // Change action to 'change'
    rerender({ isModalOpen: true, action: 'change' });

    // Now with 'change' action, it should get the current profile ID
    expect(getRecordProfileId).toHaveBeenCalledWith(mockRecord);
    expect(result.current.selectedProfileId).toBe(expectedProfileId);
  });

  test('allows manual setting of selectedProfileId', () => {
    const { result } = renderHook(() => useProfileSelectionState({ isModalOpen: true, action: 'select' }));

    const newProfileId = 'manually-set-profile-id';

    act(() => {
      result.current.setSelectedProfileId(newProfileId);
    });

    expect(result.current.selectedProfileId).toBe(newProfileId);
  });
});
