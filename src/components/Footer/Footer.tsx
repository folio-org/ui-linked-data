import { useRoutePathPattern } from '@common/hooks/useRoutePathPattern';
import { RESOURCE_EDIT_CREATE_URLS } from '@common/constants/routes.constants';
import { RecordControls } from '@components/RecordControls';
import './Footer.scss';

export const Footer = () => {
  const showRecordControls = useRoutePathPattern(RESOURCE_EDIT_CREATE_URLS);

  return showRecordControls ? (
    <div className='footer'>
      <RecordControls />
    </div>
  ) : null;
};
