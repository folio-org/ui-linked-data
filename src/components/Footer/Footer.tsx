import { useRoutePathPattern } from '@common/hooks/useRoutePathPattern';
import { EXTERNAL_RESOURCE_URLS, RESOURCE_EDIT_CREATE_URLS } from '@common/constants/routes.constants';
import { RecordControls } from '@components/RecordControls';
import { PreviewExternalResourceControls } from '@components/PreviewExternalResourceControls';
import { useInputsState, useMarcPreviewState } from '@src/store';
import './Footer.scss';

export const Footer = () => {
  const showRecordControls = useRoutePathPattern(RESOURCE_EDIT_CREATE_URLS);
  const showExternalResourceControls = useRoutePathPattern(EXTERNAL_RESOURCE_URLS);
  const { basicValue: marcPreviewData } = useMarcPreviewState(['basicValue']);
  const { record } = useInputsState(['record']);
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
