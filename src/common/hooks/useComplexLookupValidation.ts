import { useComplexLookup } from '@src/store';

export const useComplexLookupValidation = () => {
  const { addAuthorityAssignmentCheckFailedIdsItem, resetAuthorityAssignmentCheckFailedIds } = useComplexLookup();

  const addFailedEntryId = (id: string) => {
    addAuthorityAssignmentCheckFailedIdsItem?.(id);
  };

  const clearFailedEntryIds = () => {
    resetAuthorityAssignmentCheckFailedIds();
  };

  return { addFailedEntryId, clearFailedEntryIds };
};
