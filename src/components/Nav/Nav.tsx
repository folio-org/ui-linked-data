import { EXTERNAL_RESOURCE_URLS, RESOURCE_EDIT_CREATE_URLS } from '@common/constants/routes.constants';
import { DOM_ELEMENTS } from '@common/constants/domElementsIdentifiers.constants';
import { useRoutePathPattern } from '@common/hooks/useRoutePathPattern';
import { EditControlPane } from '@components/EditControlPane';
import state from '@state';
import { useRecoilValue } from 'recoil';
import { ViewMarcControlPane } from '@components/ViewMarcControlPane';
import { PreviewExternalResourcePane } from '@components/PreviewExternalResourcePane';
import './Nav.scss';
import { useMarcPreviewStore } from '@src/store';

export const Nav = () => {
  const isEditSectionOpen = useRoutePathPattern(RESOURCE_EDIT_CREATE_URLS);
  const isExternalResourceSectionOpen = useRoutePathPattern(EXTERNAL_RESOURCE_URLS);
  const { value: marcPreviewData } = useMarcPreviewStore();
  const record = useRecoilValue(state.inputs.record);
  const isVisible = isEditSectionOpen || (isExternalResourceSectionOpen && record);

  return (
    isVisible && (
      <div data-testid="nav" className={DOM_ELEMENTS.classNames.nav}>
        {isEditSectionOpen && !marcPreviewData && <EditControlPane />}
        {marcPreviewData && <ViewMarcControlPane />}
        {isExternalResourceSectionOpen && <PreviewExternalResourcePane />}
      </div>
    )
  );
};
