import { useUIState, useInputsState } from '@src/store';
import { TYPE_URIS } from '@common/constants/bibframe.constants';

export const useSaveRecordWarning = () => {
  const { hasShownAuthorityWarning, setHasShownAuthorityWarning } = useUIState();
  const { userValues, selectedRecordBlocks } = useInputsState();

  const isWorkEditPage = selectedRecordBlocks?.block === TYPE_URIS.WORK;

  const hasSelectedUncontrolledAuthority = Object.values(userValues).some((value: UserValue) =>
    value.contents.some(content => content?.meta?.isPreferred !== undefined && !content?.meta?.isPreferred),
  );

  const shouldDisplayWarningMessage = isWorkEditPage && hasSelectedUncontrolledAuthority && !hasShownAuthorityWarning;

  return {
    shouldDisplayWarningMessage,
    setHasShownAuthorityWarning,
  };
};
