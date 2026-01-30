import { TYPE_URIS } from '@/common/constants/bibframe.constants';

import { useInputsState, useUIState } from '@/store';

const hasSelectedUncontrolledAuthority = (userValues: UserValues) =>
  Object.values(userValues).some((value: UserValue) =>
    value.contents.some(content => content?.meta?.isPreferred !== undefined && !content?.meta?.isPreferred),
  );

export const useSaveRecordWarning = () => {
  const { hasShownAuthorityWarning, setHasShownAuthorityWarning } = useUIState([
    'hasShownAuthorityWarning',
    'setHasShownAuthorityWarning',
  ]);
  const { userValues, selectedRecordBlocks } = useInputsState(['userValues', 'selectedRecordBlocks']);
  const isWorkEditPage = selectedRecordBlocks?.block === TYPE_URIS.WORK;
  const shouldDisplayWarningMessage =
    isWorkEditPage && !hasShownAuthorityWarning && hasSelectedUncontrolledAuthority(userValues);

  return {
    shouldDisplayWarningMessage,
    setHasShownAuthorityWarning,
  };
};
