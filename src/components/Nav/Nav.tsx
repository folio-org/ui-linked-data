import {
  EXTERNAL_RESOURCE_URLS,
  RESOURCE_EDIT_CREATE_URLS,
  MANAGE_PROFILE_SETTINGS_URLS,
} from '@common/constants/routes.constants';
import { DOM_ELEMENTS } from '@common/constants/domElementsIdentifiers.constants';
import { useRoutePathPattern } from '@common/hooks/useRoutePathPattern';
import { EditControlPane } from '@components/EditControlPane';
import { ViewMarcControlPane } from '@components/ViewMarcControlPane';
import { PreviewExternalResourcePane } from '@components/PreviewExternalResourcePane';
import { ManageProfileSettingsControlPane } from '@/features/manageProfileSettings/components/ManageProfileSettingsControlPane';
import { useInputsState, useMarcPreviewState } from '@src/store';
import './Nav.scss';

export const Nav = () => {
  const isEditSectionOpen = useRoutePathPattern(RESOURCE_EDIT_CREATE_URLS);
  const isExternalResourceSectionOpen = useRoutePathPattern(EXTERNAL_RESOURCE_URLS);
  const isManageProfileSettingsOpen = useRoutePathPattern(MANAGE_PROFILE_SETTINGS_URLS);
  const { basicValue: marcPreviewData } = useMarcPreviewState(['basicValue']);
  const { record } = useInputsState(['record']);
  const isVisible = isEditSectionOpen || (isExternalResourceSectionOpen && record) || isManageProfileSettingsOpen;

  return (
    isVisible && (
      <div data-testid="nav" className={DOM_ELEMENTS.classNames.nav}>
        {isEditSectionOpen && !marcPreviewData && <EditControlPane />}
        {marcPreviewData && !isExternalResourceSectionOpen && <ViewMarcControlPane />}
        {isExternalResourceSectionOpen && <PreviewExternalResourcePane />}
        {isManageProfileSettingsOpen && <ManageProfileSettingsControlPane />}
      </div>
    )
  );
};
