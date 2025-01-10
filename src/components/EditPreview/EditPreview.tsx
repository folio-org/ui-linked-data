import { PROFILE_BFIDS } from '@common/constants/bibframe.constants';
import classNames from 'classnames';
import { useParams, useSearchParams } from 'react-router-dom';
import { QueryParams, RESOURCE_CREATE_URLS } from '@common/constants/routes.constants';
import { ResourceType } from '@common/constants/record.constants';
import { InstancesList } from '@components/InstancesList';
import { useRoutePathPattern } from '@common/hooks/useRoutePathPattern';
import { getRecordDependencies } from '@common/helpers/record.helper';
import { memo, useEffect } from 'react';
import { TitledPreview } from '@components/Preview/TitledPreview';
import './EditPreview.scss';
import { useInputsState, useUIState } from '@src/store';

export const EditPreview = memo(() => {
  const { record, previewContent, setPreviewContent, resetPreviewContent } = useInputsState();
  const { currentlyPreviewedEntityBfid } = useUIState();
  const isCreatePageOpen = useRoutePathPattern(RESOURCE_CREATE_URLS);
  const { resourceId } = useParams();
  const [queryParams] = useSearchParams();
  const isPositionedSecond =
    currentlyPreviewedEntityBfid.has(PROFILE_BFIDS.INSTANCE) && currentlyPreviewedEntityBfid.values.length <= 1;
  const typeParam = queryParams.get(QueryParams.Type);
  const isCreateWorkPageOpened = isCreatePageOpen && typeParam === ResourceType.work;
  const dependencies = getRecordDependencies(record);
  const showPreview = (dependencies?.entries?.length === 1 && !isCreateWorkPageOpened) || previewContent.length;
  const selectedForPreview = previewContent?.[0];

  useEffect(() => {
    resetPreviewContent();
  }, [resourceId]);

  return (
    <div
      className={classNames('preview-container', {
        'positioned-second': isPositionedSecond,
      })}
    >
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
