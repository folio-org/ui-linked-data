import {
  EXTERNAL_RESOURCE_URLS,
  MANAGE_PROFILE_SETTINGS_URLS,
  RESOURCE_EDIT_CREATE_URLS,
} from '@/common/constants/routes.constants';
import { useRoutePathPattern } from '@/common/hooks/useRoutePathPattern';
import { PreviewExternalResourceControls } from '@/components/PreviewExternalResourceControls';
import { RecordControls } from '@/components/RecordControls';

import { ManageProfileSettingsControls } from '@/features/manageProfileSettings/components/ManageProfileSettingsControls/ManageProfileSettingsControls';

import { useInputsState, useMarcPreviewState } from '@/store';

import './Footer.scss';

export const Footer = () => {
  const showRecordControls = useRoutePathPattern(RESOURCE_EDIT_CREATE_URLS);
  const showExternalResourceControls = useRoutePathPattern(EXTERNAL_RESOURCE_URLS);
  const showManageProfileSettingsControls = useRoutePathPattern(MANAGE_PROFILE_SETTINGS_URLS);
  const { basicValue: marcPreviewData } = useMarcPreviewState(['basicValue']);
  const { record } = useInputsState(['record']);
  const isVisible =
    ((showRecordControls || (showExternalResourceControls && record)) && !marcPreviewData) ||
    showManageProfileSettingsControls;

  return (
    isVisible && (
      <div className="footer">
        {showRecordControls && <RecordControls />}
        {showExternalResourceControls && <PreviewExternalResourceControls />}
        {showManageProfileSettingsControls && <ManageProfileSettingsControls />}
      </div>
    )
  );
};
