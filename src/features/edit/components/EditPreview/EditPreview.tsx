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
  const [isDismissed, setIsDismissed] = useState(false);

  // Resolve resource type: from loaded record (Edit) or URL param (Create)
  const blockUri = selectedRecordBlocks?.block;
  const resourceType = resolveResourceType(blockUri, typeParam);
  const shouldShowPreview = hasSplitLayout(resourceType);
  const previewPosition = getPreviewPosition(resourceType);

  const isPositionedSecond = previewPosition === 'right';
  const isCreateWorkPageOpened = isCreatePageOpen && typeParam === ResourceType.work;
  const dependencies = getRecordDependencies(record);
  const linkedEntityId = dependencies?.entries?.[0]?.id?.toString();

  const { altSchema, altUserValues, altInitKey, title } = useEditPreview(linkedEntityId);

  // Reset dismiss state when navigating to a different resource
  useEffect(() => {
    setIsDismissed(false);
  }, [resourceId]);

  const previewData =
    !isDismissed && altUserValues && Object.keys(altUserValues).length > 0
      ? ({
          id: linkedEntityId ?? '',
          base: altSchema ?? new Map(),
          userValues: altUserValues,
          initKey: altInitKey ?? '',
          selectedEntries: [],
          title,
        } as PreviewContent)
      : undefined;

  const showPreview = (dependencies?.entries?.length === 1 && !isCreateWorkPageOpened) || !!previewData;

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
          onClickClose={() => setIsDismissed(true)}
          showCloseCtl={(dependencies?.entries?.length ?? 0) > 1}
        />
      ) : (
        <InstancesList type={dependencies?.type} refId={resourceId} contents={dependencies} />
      )}
    </div>
  );
});
