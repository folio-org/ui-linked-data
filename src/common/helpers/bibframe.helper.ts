import { RecordEditActions } from '@/common/constants/record.constants';
import { QueryParams, ROUTES } from '@/common/constants/routes.constants';

export const getEditActionPrefix = (route?: string, search?: URLSearchParams) => {
  if (route === ROUTES.RESOURCE_CREATE.uri) {
    return search?.get(QueryParams.CloneOf) ? RecordEditActions.Duplicate : RecordEditActions.New;
  } else {
    return RecordEditActions.Edit;
  }
};
