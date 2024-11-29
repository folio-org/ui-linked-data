import { useRoutePathPattern } from '@common/hooks/useRoutePathPattern';
import { EXTERNAL_RESOURCE_URLS, RESOURCE_EDIT_CREATE_URLS } from '@common/constants/routes.constants';
import { RecordControls } from '@components/RecordControls';
import state from '@state';
import { useRecoilValue } from 'recoil';
import { PreviewExternalResourceControls } from '@components/PreviewExternalResourceControls';
import './Footer.scss';
import { useMarcPreviewState } from '@src/store';

export const Footer = () => {
  const showRecordControls = useRoutePathPattern(RESOURCE_EDIT_CREATE_URLS);
  const showExternalResourceControls = useRoutePathPattern(EXTERNAL_RESOURCE_URLS);
  const { value: marcPreviewData } = useMarcPreviewState();
  const record = useRecoilValue(state.inputs.record);
  const isVisible = (showRecordControls || (showExternalResourceControls && record)) && !marcPreviewData;

  return (
    isVisible && (
      <div className="footer">
        {showRecordControls && <RecordControls />}
        {showExternalResourceControls && <PreviewExternalResourceControls />}
      </div>
    )
  );
};
