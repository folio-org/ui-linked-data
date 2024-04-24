import { useRoutePathPattern } from '@common/hooks/useRoutePathPattern';
import { RESOURCE_EDIT_CREATE_URLS } from '@common/constants/routes.constants';
import { RecordControls } from '@components/RecordControls';
import './Footer.scss';
import state from '@state';
import { useRecoilValue } from 'recoil';

export const Footer = () => {
  const showRecordControls = useRoutePathPattern(RESOURCE_EDIT_CREATE_URLS);
  const marcPreviewData = useRecoilValue(state.data.marcPreview);

  return showRecordControls && !marcPreviewData ? (
    <div className='footer'>
      <RecordControls />
    </div>
  ) : null;
};
