import { useParams, useSearchParams } from 'react-router-dom';

import {
  EXTERNAL_RESOURCE_URLS,
  HUB_IMPORT_URLS,
  MANAGE_PROFILE_SETTINGS_URLS,
  QueryParams,
  RESOURCE_EDIT_CREATE_URLS,
} from '@/common/constants/routes.constants';
import { useRoutePathPattern } from '@/common/hooks/useRoutePathPattern';
import { PreviewExternalResourceControls } from '@/views/ExternalResource/components/PreviewExternalResourceControls';

import { RecordControls } from '@/features/edit';
import { HubImportControls, useHubQuery } from '@/features/hubImport';
import { ManageProfileSettingsControls } from '@/features/manageProfileSettings/components/ManageProfileSettingsControls/ManageProfileSettingsControls';
import { useResourcePreviewQuery } from '@/features/resources';

import { useMarcPreviewState } from '@/store';

import './Footer.scss';

export const Footer = () => {
  const showRecordControls = useRoutePathPattern(RESOURCE_EDIT_CREATE_URLS);
  const showExternalResourceControls = useRoutePathPattern(EXTERNAL_RESOURCE_URLS);
  const showHubImportControls = useRoutePathPattern(HUB_IMPORT_URLS);
  const showManageProfileSettingsControls = useRoutePathPattern(MANAGE_PROFILE_SETTINGS_URLS);
  const { basicValue: marcPreviewData } = useMarcPreviewState(['basicValue']);

  const { externalId } = useParams();
  const { data: externalResourceData } = useResourcePreviewQuery(
    showExternalResourceControls ? externalId : undefined,
    'edit-link',
  );

  const [searchParams] = useSearchParams();
  const sourceUri = searchParams.get(QueryParams.SourceUri);
  const { data: hubData } = useHubQuery({ hubUri: showHubImportControls ? (sourceUri ?? undefined) : undefined });

  const isVisible =
    ((showRecordControls ||
      (showExternalResourceControls && !!externalResourceData) ||
      (showHubImportControls && !!hubData)) &&
      !marcPreviewData) ||
    showManageProfileSettingsControls;

  return (
    isVisible && (
      <div className="footer">
        {showRecordControls && <RecordControls />}
        {showExternalResourceControls && <PreviewExternalResourceControls />}
        {showHubImportControls && <HubImportControls />}
        {showManageProfileSettingsControls && <ManageProfileSettingsControls />}
      </div>
    )
  );
};
