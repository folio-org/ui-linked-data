import { RESOURCE_EDIT_CREATE_URLS } from '@common/constants/routes.constants';
import { DOM_ELEMENTS } from '@common/constants/domElementsIdentifiers.constants';
import { useRoutePathPattern } from '@common/hooks/useRoutePathPattern';
import { EditControlPane } from '@components/EditControlPane';
import state from '@state';
import { useRecoilValue } from 'recoil';
import './Nav.scss';
import { ViewMarcControlPane } from '@components/ViewMarcControlPane';

export const Nav = () => {
  const isEditSectionOpen = useRoutePathPattern(RESOURCE_EDIT_CREATE_URLS);
  const marcPreviewData = useRecoilValue(state.data.marcPreview);

  return (
    <div data-testid="nav" className={DOM_ELEMENTS.classNames.nav}>
      {isEditSectionOpen && !marcPreviewData && <EditControlPane />}
      {marcPreviewData && <ViewMarcControlPane />}
    </div>
  );
};
