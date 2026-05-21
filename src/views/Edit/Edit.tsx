import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { QueryParams } from '@/common/constants/routes.constants';
import { getResourceIdFromUri } from '@/common/helpers/navigation.helper';
import { scrollEntity } from '@/common/helpers/pageScrolling.helper';
import { hasSplitLayout, mapToResourceType } from '@/configs/resourceTypes';
import { SchemaPipelineProvider } from '@/providers';

import { EditPreview, EditSection, ModalViewMarc, useResetRecordStatus } from '@/features/edit';
import { useEditPage } from '@/features/edit/hooks/useEditPage';
import { useRecordNavigation } from '@/features/resources';

import { useMarcPreviewState, useUIState } from '@/store';

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
  const [searchParams] = useSearchParams();
  const cloneOfParam = searchParams.get(QueryParams.CloneOf);
  const typeParam = searchParams.get(QueryParams.Type);
  const refParam = searchParams.get(QueryParams.Ref);

  const resourceType = mapToResourceType(typeParam);
  const showPreviewSection = hasSplitLayout(resourceType);

  useResetRecordStatus();

  useEffect(() => {
    resetMarcPreviewData();
    scrollEntity({ top: 0, behavior: 'instant' });

    if (resourceId || cloneOfParam || refParam) {
      loadResource(resourceId ?? cloneOfParam, { asClone: !!cloneOfParam, ref: refParam });
    } else {
      initNewResource();
    }

    return () => clearRecordState();
  }, [resourceId, cloneOfParam, refParam, resourceType]);

  useEffect(() => {
    resetHasShownAuthorityWarning();
  }, [resourceId]);

  return (
    <div data-testid="edit-page" className="edit-page">
      {!marcPreviewData && (
        <>
          {showPreviewSection && (
            <SchemaPipelineProvider>
              <EditPreview />
            </SchemaPipelineProvider>
          )}
          <EditSection />
        </>
      )}
      <ModalViewMarc />
    </div>
  );
};
