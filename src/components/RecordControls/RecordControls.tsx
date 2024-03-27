import { memo } from 'react';
import { SaveRecord } from '@components/SaveRecord';
import { CloseRecord } from '@components/CloseRecord';
import './RecordControls.scss';
import { useRoutePathPattern } from '@common/hooks/useRoutePathPattern';
import { RESOURCE_EDIT_CREATE_URLS } from '@common/constants/routes.constants';

export const RecordControls = memo(() => {
  const isEditSectionOpen = useRoutePathPattern(RESOURCE_EDIT_CREATE_URLS);

  return isEditSectionOpen ? (
    <div className="record-controls">
      <CloseRecord />
      <SaveRecord locally />
      <SaveRecord />
    </div>
  ) : null;
});
