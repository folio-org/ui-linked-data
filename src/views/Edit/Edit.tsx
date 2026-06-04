import { useEffect, useLayoutEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { QueryParams } from '@/common/constants/routes.constants';
import { getResourceIdFromUri } from '@/common/helpers/navigation.helper';
import { scrollEntity } from '@/common/helpers/pageScrolling.helper';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { hasSplitLayout, mapToResourceType } from '@/configs/resourceTypes';

import { EditPreview, EditSection, ModalViewMarc, useResetRecordStatus } from '@/features/edit';
import { useEditPage } from '@/features/edit/hooks/useEditPage';
import { useRecordNavigation } from '@/features/resources';

import { useLoadingState, useMarcPreviewState, useUIState } from '@/store';

import './Edit.scss';

export const Edit = () => {
  const { initNewResource, loadResource } = useEditPage();
  const { clearRecordState } = useRecordNavigation();
  const resourceId = getResourceIdFromUri();
  const { basicValue: marcPreviewData, resetBasicValue: resetMarcPreviewData } = useMarcPreviewState([
    'basicValue',
    'resetBasicValue',
  ]);
  const { resetHasShownAuthorityWarning } = useUIState(['resetHasShownAuthorityWarning']);
  const { setIsLoading, setIsPreviewLoading } = useLoadingState(['setIsLoading', 'setIsPreviewLoading']);
  const [searchParams] = useSearchParams();
  const cloneOfParam = searchParams.get(QueryParams.CloneOf);
  const typeParam = searchParams.get(QueryParams.Type);
  const refParam = searchParams.get(QueryParams.Ref);

  const resourceType = mapToResourceType(typeParam);
  const showPreviewSection = hasSplitLayout(resourceType);

  useResetRecordStatus();

  useLayoutEffect(() => {
    setIsLoading(true);
  }, [resourceId, cloneOfParam, refParam, resourceType]);

  useEffect(() => {
    let cancelled = false;

    resetMarcPreviewData();
    scrollEntity({ top: 0, behavior: 'instant' });

    if (resourceId || cloneOfParam || refParam) {
      loadResource(resourceId ?? cloneOfParam, { asClone: !!cloneOfParam, ref: refParam }, () => cancelled);
    } else {
      initNewResource(() => cancelled);
    }

    return () => {
      cancelled = true;
      clearRecordState();
      setIsLoading(false);
      setIsPreviewLoading(false);
    };
  }, [resourceId, cloneOfParam, refParam, resourceType]);

  useEffect(() => {
    resetHasShownAuthorityWarning();
  }, [resourceId]);

  return (
    <div data-testid="edit-page" className="edit-page">
      {!marcPreviewData && (
        <>
          {showPreviewSection && (
            <ErrorBoundary>
              <EditPreview />
            </ErrorBoundary>
          )}
          <ErrorBoundary>
            <EditSection />
          </ErrorBoundary>
        </>
      )}
      <ModalViewMarc />
    </div>
  );
};
