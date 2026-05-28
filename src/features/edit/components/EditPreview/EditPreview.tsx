import { memo, useLayoutEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import classNames from 'classnames';

import { ResourceType } from '@/common/constants/record.constants';
import { QueryParams, RESOURCE_CREATE_URLS } from '@/common/constants/routes.constants';
import { getRecordDependencies } from '@/common/helpers/record.helper';
import { useRoutePathPattern } from '@/common/hooks/useRoutePathPattern';
import { getPreviewPosition, hasSplitLayout, resolveResourceType } from '@/configs/resourceTypes';

import { useEditPreview } from '@/features/edit/hooks';
import { TitledPreview } from '@/features/preview/components/Preview/TitledPreview';

import { useInputsState, useLoadingState } from '@/store';

import { InstancesList } from '../InstancesList';

import './EditPreview.scss';

export const EditPreview = memo(() => {
  const { record, selectedRecordBlocks } = useInputsState(['record', 'selectedRecordBlocks']);
  const isCreatePageOpen = useRoutePathPattern(RESOURCE_CREATE_URLS);
  const { resourceId } = useParams();
  const [queryParams] = useSearchParams();
  const typeParam = queryParams.get(QueryParams.Type);
  const [selection, setSelection] = useState<{ instanceId?: string }>({});
  const [prevResourceId, setPrevResourceId] = useState(resourceId);

  // Reset instance selection whenever the work resource changes (e.g. navigating work->instance->work)
  // so the instance list is shown instead of the previously opened preview.
  if (prevResourceId !== resourceId) {
    setPrevResourceId(resourceId);
    setSelection({});
  }

  // Derive selected instance — automatically resets when navigating to a different resource
  const selectedInstanceId = selection.instanceId;

  const { setIsPreviewLoading } = useLoadingState(['setIsPreviewLoading']);

  // Resolve resource type: from loaded record (Edit) or URL param (Create)
  const blockUri = selectedRecordBlocks?.block;
  const resourceType = resolveResourceType(blockUri, typeParam);
  const shouldShowPreview = hasSplitLayout(resourceType);
  const previewPosition = getPreviewPosition(resourceType);

  const isPositionedSecond = previewPosition === 'right';
  const isCreateWorkPageOpened = isCreatePageOpen && typeParam === ResourceType.work;
  const dependencies = getRecordDependencies(record);
  const isSingleInstance = dependencies?.entries?.length === 1;
  const linkedEntityId = (dependencies?.entries?.[0] as { id?: string } | undefined)?.id;
  const previewInstanceId = isSingleInstance ? linkedEntityId : selectedInstanceId;
  // Only query when the dependency is an instance — Work preview uses the store schema directly
  const instancePreviewId = dependencies?.type === ResourceType.instance ? previewInstanceId : undefined;

  const { data: previewData, isLoading } = useEditPreview(instancePreviewId);

  useLayoutEffect(() => {
    setIsPreviewLoading(isLoading);

    return () => setIsPreviewLoading(false);
  }, [isLoading, setIsPreviewLoading]);

  const hasPreviewContent = previewData && Object.keys(previewData.userValues).length > 0;

  const showPreview = !!previewInstanceId && !isCreateWorkPageOpened;

  if (!shouldShowPreview) {
    return null;
  }

  return (
    <div
      className={classNames('preview-container', {
        'positioned-second': isPositionedSecond,
      })}
    >
      {showPreview ? (
        <TitledPreview
          ownId={linkedEntityId}
          refId={resourceId ?? queryParams.get(QueryParams.Ref)}
          type={dependencies?.type}
          previewContent={hasPreviewContent ? previewData : undefined}
          onClickClose={() => setSelection({ instanceId: undefined })}
          showCloseCtl={(dependencies?.entries?.length ?? 0) > 1}
        />
      ) : (
        <InstancesList
          type={dependencies?.type}
          refId={resourceId}
          contents={dependencies}
          onSelectInstance={id => setSelection({ instanceId: id })}
        />
      )}
    </div>
  );
});
