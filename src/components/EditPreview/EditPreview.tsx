import { Preview } from '@components/Preview';
import { Button, ButtonType } from '@components/Button';
import './EditPreview.scss';
import { PROFILE_BFIDS } from '@common/constants/bibframe.constants';
import state from '@state';
import classNames from 'classnames';
import { useRecoilValue } from 'recoil';
import { FormattedMessage } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '@common/constants/routes.constants';
import { ResourceType } from '@common/constants/record.constants';

export const EditPreview = () => {
  const currentlyPreviewedEntityBfid = useRecoilValue(state.ui.currentlyPreviewedEntityBfid);
  const isPositionedSecond =
    currentlyPreviewedEntityBfid.has(PROFILE_BFIDS.INSTANCE) && currentlyPreviewedEntityBfid.values.length <= 1;
  const navigate = useNavigate();
  const { resourceId } = useParams();

  return (
    <div
      className={classNames('preview-container', {
        'positioned-second': isPositionedSecond,
      })}
    >
      {currentlyPreviewedEntityBfid.has(PROFILE_BFIDS.INSTANCE) && (
        <div className="preview-container-header">
          <strong className='header'>
            <FormattedMessage id="marva.instances" />
          </strong>
          <Button
            type={ButtonType.Primary}
            onClick={() => navigate(`${ROUTES.RESOURCE_CREATE.uri}?type=${ResourceType.instance}&ref=${resourceId}`)}
          >
            <FormattedMessage id="marva.addNewInstance" />
          </Button>
        </div>
      )}
      <Preview headless />
    </div>
  );
};
