import { memo, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import classNames from 'classnames';

import { ResourceType } from '@/common/constants/record.constants';
import { QueryParams, RESOURCE_CREATE_URLS } from '@/common/constants/routes.constants';
import { getRecordDependencies } from '@/common/helpers/record.helper';
import { useRoutePathPattern } from '@/common/hooks/useRoutePathPattern';
import { getPreviewPosition, hasSplitLayout, resolveResourceType } from '@/configs/resourceTypes';

import { useEditPreview } from '@/features/edit/hooks';
import { TitledPreview } from '@/features/preview/components/Preview/TitledPreview';

import { useInputsState } from '@/store';

import { InstancesList } from '../InstancesList';

import './EditPreview.scss';

export const EditPreview = memo(() => {
  const { record, selectedRecordBlocks } = useInputsState(['record', 'selectedRecordBlocks']);
  const isCreatePageOpen = useRoutePathPattern(RESOURCE_CREATE_URLS);
  const { resourceId } = useParams();
  const [queryParams] = useSearchParams();
  const typeParam = queryParams.get(QueryParams.Type);
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | undefined>(undefined);

  // Resolve resource type: from loaded record (Edit) or URL param (Create)
  const blockUri = selectedRecordBlocks?.block;
  const resourceType = resolveResourceType(blockUri, typeParam);
  const shouldShowPreview = hasSplitLayout(resourceType);
  const previewPosition = getPreviewPosition(resourceType);

  const isPositionedSecond = previewPosition === 'right';
  const isCreateWorkPageOpened = isCreatePageOpen && typeParam === ResourceType.work;
  const dependencies = getRecordDependencies(record);
  const isSingleInstance = dependencies?.entries?.length === 1;
  const linkedEntityId = dependencies?.entries?.[0]?.id?.toString();
  const previewInstanceId = isSingleInstance ? linkedEntityId : selectedInstanceId;

  const { altSchema, altUserValues, altInitKey, title } = useEditPreview(previewInstanceId);

  // Reset selected instance when navigating to a different resource
  useEffect(() => {
    setSelectedInstanceId(undefined);
  }, [resourceId]);

  const previewData =
    altUserValues && Object.keys(altUserValues).length > 0
      ? ({
          id: linkedEntityId ?? '',
          base: altSchema ?? new Map(),
          userValues: altUserValues,
          initKey: altInitKey ?? '',
          selectedEntries: [],
          title,
        } as PreviewContent)
      : undefined;

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
          previewContent={previewData}
          onClickClose={() => setSelectedInstanceId(undefined)}
          showCloseCtl={(dependencies?.entries?.length ?? 0) > 1}
        />
      ) : (
        <InstancesList
          type={dependencies?.type}
          refId={resourceId}
          contents={dependencies}
          onSelectInstance={setSelectedInstanceId}
        />
      )}
    </div>
  );
});
