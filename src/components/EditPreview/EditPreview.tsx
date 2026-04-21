import { memo, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import classNames from 'classnames';

import { ResourceType } from '@/common/constants/record.constants';
import { QueryParams, RESOURCE_CREATE_URLS } from '@/common/constants/routes.constants';
import { getRecordDependencies } from '@/common/helpers/record.helper';
import { useRoutePathPattern } from '@/common/hooks/useRoutePathPattern';
import { InstancesList } from '@/components/InstancesList';
import { TitledPreview } from '@/components/Preview/TitledPreview';
import { getPreviewPosition, hasSplitLayout, resolveResourceType } from '@/configs/resourceTypes';

import { useInputsState } from '@/store';

import './EditPreview.scss';

export const EditPreview = memo(() => {
  const { record, previewContent, selectedRecordBlocks, setPreviewContent, resetPreviewContent } = useInputsState([
    'record',
    'previewContent',
    'selectedRecordBlocks',
    'setPreviewContent',
    'resetPreviewContent',
  ]);
  const isCreatePageOpen = useRoutePathPattern(RESOURCE_CREATE_URLS);
  const { resourceId } = useParams();
  const [queryParams] = useSearchParams();
  const typeParam = queryParams.get(QueryParams.Type);

  // Resolve resource type: from loaded record (Edit) or URL param (Create)
  const blockUri = selectedRecordBlocks?.block;
  const resourceType = resolveResourceType(blockUri, typeParam);
  const shouldShowPreview = hasSplitLayout(resourceType);
  const previewPosition = getPreviewPosition(resourceType);

  const isPositionedSecond = previewPosition === 'right';
  const isCreateWorkPageOpened = isCreatePageOpen && typeParam === ResourceType.work;
  const dependencies = getRecordDependencies(record);
  const showPreview = (dependencies?.entries?.length === 1 && !isCreateWorkPageOpened) || previewContent.length;
  const selectedForPreview = previewContent?.[0];

  useEffect(() => {
    resetPreviewContent();
  }, [resourceId]);

  useEffect(() => {
    if (isCreateWorkPageOpened) {
      const initialInputsState = useInputsState.getInitialState();

      useInputsState.setState(initialInputsState, true);
    }
  }, [isCreateWorkPageOpened]);

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
