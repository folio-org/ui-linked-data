import { renderHook } from '@testing-library/react';
import { setInitialGlobalState } from '@/test/__mocks__/store';
import { useComplexLookupValidation } from '@/features/complexLookup/hooks/useComplexLookupValidation';
import { useComplexLookupStore } from '@/store/stores/complexLookup';

describe('useComplexLookupValidation', () => {
  const mockAddAuthorityAssignmentCheckFailedIdsItem = jest.fn();
  const mockResetAuthorityAssignmentCheckFailedIds = jest.fn();

  beforeEach(() => {
    setInitialGlobalState([
      {
        store: useComplexLookupStore,
        state: {
          authorityAssignmentCheckFailedIds: ['existing-id-1', 'existing-id-2'],
          addAuthorityAssignmentCheckFailedIdsItem: mockAddAuthorityAssignmentCheckFailedIdsItem,
          resetAuthorityAssignmentCheckFailedIds: mockResetAuthorityAssignmentCheckFailedIds,
        },
      },
    ]);
  });

  describe('addFailedEntryId', () => {
    it('addAuthorityAssignmentCheckFailedIdsItem with provided id', () => {
      const testId = 'test-id';

      const { result } = renderHook(() => useComplexLookupValidation());
      result.current.addFailedEntryId(testId);

      expect(mockAddAuthorityAssignmentCheckFailedIdsItem).toHaveBeenCalledWith(testId);
    });
  });

  describe('clearFailedEntryIds', () => {
    it('calls resetAuthorityAssignmentCheckFailedIds', () => {
      const { result } = renderHook(() => useComplexLookupValidation());
      result.current.clearFailedEntryIds();

      expect(mockResetAuthorityAssignmentCheckFailedIds).toHaveBeenCalled();
    });
  });

  describe('checkFailedId', () => {
    it('returns true for existing id', () => {
      const { result } = renderHook(() => useComplexLookupValidation());
      const exists = result.current.checkFailedId('existing-id-1');

      expect(exists).toBe(true);
    });

    it('returns false for non-existing id', () => {
      const { result } = renderHook(() => useComplexLookupValidation());
      const exists = result.current.checkFailedId('non-existing-id');

      expect(exists).toBe(false);
    });

    it('returns false for undefined id', () => {
      const { result } = renderHook(() => useComplexLookupValidation());
      const exists = result.current.checkFailedId();

      expect(exists).toBe(false);
    });
  });
});
