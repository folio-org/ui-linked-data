import { Preview } from '@components/Preview';
import { Button, ButtonType } from '@components/Button';
import './EditPreview.scss';
import { PROFILE_BFIDS } from '@common/constants/bibframe.constants';
import state from '@state';
import classNames from 'classnames';
import { useRecoilValue } from 'recoil';
import { FormattedMessage } from 'react-intl';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { QueryParams, RESOURCE_CREATE_URLS, ROUTES } from '@common/constants/routes.constants';
import { ResourceType } from '@common/constants/record.constants';
import { InstancesList } from '@components/InstancesList';
import { useRoutePathPattern } from '@common/hooks/useRoutePathPattern';

export const EditPreview = () => {
  const currentlyPreviewedEntityBfid = useRecoilValue(state.ui.currentlyPreviewedEntityBfid);
  const isPositionedSecond =
    currentlyPreviewedEntityBfid.has(PROFILE_BFIDS.INSTANCE) && currentlyPreviewedEntityBfid.values.length <= 1;
  const { resourceId } = useParams();
  const isCreatePageOpen = useRoutePathPattern(RESOURCE_CREATE_URLS);
  const [queryParams] = useSearchParams();
  const navigate = useNavigate();
  const typeParam = queryParams.get(QueryParams.Type);
  const isCreateWorkPageOpened = isCreatePageOpen && typeParam === ResourceType.work;

  return (
    <div
      className={classNames('preview-container', {
        'positioned-second': isPositionedSecond,
      })}
    >
      {currentlyPreviewedEntityBfid.has(PROFILE_BFIDS.INSTANCE) && (
        <div className="preview-container-header">
          <strong className="header">
            <FormattedMessage id="marva.instances" />
          </strong>
          <Button
            type={ButtonType.Highlighted}
            onClick={() => navigate(`${ROUTES.RESOURCE_CREATE.uri}?type=${ResourceType.instance}&ref=${resourceId ?? ''}`)}
          >
            <FormattedMessage id="marva.addInstance" />
          </Button>
        </div>
      )}

      {!isCreateWorkPageOpened && <Preview headless />}
      {isCreateWorkPageOpened && <InstancesList />}
    </div>
  );
};
