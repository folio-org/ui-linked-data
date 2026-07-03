import { useEffect, useLayoutEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { QueryParams } from '@/common/constants/routes.constants';
import { scrollEntity } from '@/common/helpers/pageScrolling.helper';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { hasSplitLayout, mapToResourceType } from '@/configs/resourceTypes';

import { EditPreview, EditSection, ModalViewMarc, useEditPage, useResetRecordStatus } from '@/features/edit';
import { useRecordNavigation } from '@/features/resources';

import { useLoadingState, useMarcPreviewState, useProfileState, useUIState } from '@/store';

import './Edit.scss';

export const Edit = () => {
  const { initNewResource, loadResource, applyUpdatedSettingsToResource } = useEditPage();
  const { clearRecordState } = useRecordNavigation();
  const resourceId = useParams().resourceId;
  const { basicValue: marcPreviewData, resetBasicValue: resetMarcPreviewData } = useMarcPreviewState([
    'basicValue',
    'resetBasicValue',
  ]);
  const { resetHasShownAuthorityWarning } = useUIState(['resetHasShownAuthorityWarning']);
  const { setIsLoading, setIsPreviewLoading } = useLoadingState(['setIsLoading', 'setIsPreviewLoading']);
  const { selectedProfileSettingsId } = useProfileState(['selectedProfileSettingsId']);
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
      setIsLoading(false);
      setIsPreviewLoading(false);
    };
  }, [resourceId, cloneOfParam, refParam, resourceType]);

  useEffect(() => {
    return () => {
      clearRecordState();
    };
  }, []);

  useEffect(() => {
    resetHasShownAuthorityWarning();
  }, [resourceId]);

  useEffect(() => {
    if (selectedProfileSettingsId) {
      applyUpdatedSettingsToResource(selectedProfileSettingsId);
    }
  }, [selectedProfileSettingsId]);

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
