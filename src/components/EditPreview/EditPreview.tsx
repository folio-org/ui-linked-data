import { Button, ButtonType } from '@components/Button';
import { PROFILE_BFIDS } from '@common/constants/bibframe.constants';
import state from '@state';
import classNames from 'classnames';
import { useRecoilState, useRecoilValue } from 'recoil';
import { FormattedMessage } from 'react-intl';
import { useParams, useSearchParams } from 'react-router-dom';
import { QueryParams, RESOURCE_CREATE_URLS, ROUTES } from '@common/constants/routes.constants';
import { ResourceType } from '@common/constants/record.constants';
import { InstancesList } from '@components/InstancesList';
import { useRoutePathPattern } from '@common/hooks/useRoutePathPattern';
import { useNavigateToEditPage } from '@common/hooks/useNavigateToEditPage';
import { getRecordDependencies } from '@common/helpers/record.helper';
import { memo } from 'react';
import { TitledPreview } from '@components/Preview/TitledPreview';
import './EditPreview.scss';

export const EditPreview = memo(() => {
  const currentlyPreviewedEntityBfid = useRecoilValue(state.ui.currentlyPreviewedEntityBfid);
  const isEdited = useRecoilValue(state.status.recordIsEdited);
  const record = useRecoilValue(state.inputs.record);
  const [previewContent, setPreviewContent] = useRecoilState(state.inputs.previewContent);
  const isCreatePageOpen = useRoutePathPattern(RESOURCE_CREATE_URLS);
  const { resourceId } = useParams();
  const { navigateToEditPage } = useNavigateToEditPage();
  const [queryParams] = useSearchParams();
  const isPositionedSecond =
    currentlyPreviewedEntityBfid.has(PROFILE_BFIDS.INSTANCE) && currentlyPreviewedEntityBfid.values.length <= 1;
  const typeParam = queryParams.get(QueryParams.Type);
  const isCreateWorkPageOpened = isCreatePageOpen && typeParam === ResourceType.work;
  const dependencies = getRecordDependencies(record);
  const showPreview = (dependencies?.entries?.length === 1 && !isCreateWorkPageOpened) || previewContent.length;
  const selectedForPreview = previewContent?.[0];

  return (
    <div
      className={classNames('preview-container', {
        'positioned-second': isPositionedSecond,
      })}
    >
      {currentlyPreviewedEntityBfid.has(PROFILE_BFIDS.INSTANCE) && !dependencies && (
        <div className="preview-container-header">
          <Button
            data-testid="create-instance-button"
            type={ButtonType.Highlighted}
            onClick={() =>
              navigateToEditPage(`${ROUTES.RESOURCE_CREATE.uri}?type=${ResourceType.instance}&ref=${resourceId ?? ''}`)
            }
            disabled={!record || isEdited || Boolean(queryParams.get(QueryParams.CloneOf))}
          >
            <FormattedMessage id="ld.addInstance" />
          </Button>
        </div>
      )}
      {showPreview ? (
        <TitledPreview
          ownId={dependencies?.entries?.[0]?.id?.toString()}
          refId={resourceId ?? queryParams.get(QueryParams.Ref)}
          type={dependencies?.type}
          previewContent={selectedForPreview}
          onClickClose={() => setPreviewContent(prev => prev.filter(({ id }) => id !== selectedForPreview.id))}
          showCloseCtl={(dependencies?.entries?.length ?? 0) > 1}
        />
      ) : (
        <InstancesList type={dependencies?.type} refId={resourceId} contents={dependencies} />
      )}
    </div>
  );
});
