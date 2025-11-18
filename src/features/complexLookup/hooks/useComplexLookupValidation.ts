import { useComplexLookupState } from '@src/store';

export const useComplexLookupValidation = () => {
  const {
    authorityAssignmentCheckFailedIds,
    addAuthorityAssignmentCheckFailedIdsItem,
    resetAuthorityAssignmentCheckFailedIds,
  } = useComplexLookupState([
    'authorityAssignmentCheckFailedIds',
    'addAuthorityAssignmentCheckFailedIdsItem',
    'resetAuthorityAssignmentCheckFailedIds',
  ]);

  const addFailedEntryId = (id: string) => {
    addAuthorityAssignmentCheckFailedIdsItem?.(id);
  };

  const clearFailedEntryIds = () => {
    resetAuthorityAssignmentCheckFailedIds();
  };

  const checkFailedId = (id?: string) => {
    if (!id) return false;

    return authorityAssignmentCheckFailedIds.includes(id);
  };

  return { addFailedEntryId, clearFailedEntryIds, checkFailedId };
};
