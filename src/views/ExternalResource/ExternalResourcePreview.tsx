import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { ExternalResourceIdType } from '@/common/constants/api.constants';
import { EDIT_ALT_DISPLAY_LABELS } from '@/common/constants/uiElements.constants';
import { useRecordControls } from '@/common/hooks/useRecordControls';
import { ExternalResourceLoader } from '@/components/ExternalResourceLoader';
import { ModalDuplicateImportedResource } from '@/components/ModalDuplicateImportedResource';
import { Preview } from '@/components/Preview';

import { useInputsState, useMarcPreviewState } from '@/store';

import './ExternalResourcePreview.scss';

export const ExternalResourcePreview = () => {
  const { record } = useInputsState(['record']);
  const { fetchExternalRecordForPreview } = useRecordControls();
  const { resetBasicValue } = useMarcPreviewState(['resetBasicValue']);
  const { externalId } = useParams();

  useEffect(() => {
    // TODO: UILD-443 - if applicable in future, pass in resource type from query params
    fetchExternalRecordForPreview(externalId, ExternalResourceIdType.Inventory);

    // TODO: UILD-552 - temporary solution. Reset the whole state on application unload.
    resetBasicValue();
  }, [externalId]);

  return (
    <div className="external-resource-preview">
      {record ? (
        <Preview altDisplayNames={EDIT_ALT_DISPLAY_LABELS} forceRenderAllTopLevelEntities entityRowDisplay />
      ) : (
        <ExternalResourceLoader />
      )}
      <ModalDuplicateImportedResource />
    </div>
  );
};
