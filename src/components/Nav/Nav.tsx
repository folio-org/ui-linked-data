import { EXTERNAL_RESOURCE_URLS, RESOURCE_EDIT_CREATE_URLS } from '@common/constants/routes.constants';
import { DOM_ELEMENTS } from '@common/constants/domElementsIdentifiers.constants';
import { useRoutePathPattern } from '@common/hooks/useRoutePathPattern';
import { EditControlPane } from '@components/EditControlPane';
import { ViewMarcControlPane } from '@components/ViewMarcControlPane';
import { PreviewExternalResourcePane } from '@components/PreviewExternalResourcePane';
import { useInputsState, useMarcPreviewState } from '@src/store';
import './Nav.scss';

export const Nav = () => {
  const isEditSectionOpen = useRoutePathPattern(RESOURCE_EDIT_CREATE_URLS);
  const isExternalResourceSectionOpen = useRoutePathPattern(EXTERNAL_RESOURCE_URLS);
  const { basicValue: marcPreviewData } = useMarcPreviewState();
  const { record } = useInputsState();
  const isVisible = isEditSectionOpen || (isExternalResourceSectionOpen && record);

  return (
    isVisible && (
      <div data-testid="nav" className={DOM_ELEMENTS.classNames.nav}>
        {isEditSectionOpen && !marcPreviewData && <EditControlPane />}
        {marcPreviewData && !isExternalResourceSectionOpen && <ViewMarcControlPane />}
        {isExternalResourceSectionOpen && <PreviewExternalResourcePane />}
      </div>
    )
  );
};
