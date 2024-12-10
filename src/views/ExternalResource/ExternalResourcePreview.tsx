import { ExternalResourceLoader } from '@components/ExternalResourceLoader';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useRecordControls } from '@common/hooks/useRecordControls';
import { ExternalResourceIdType } from '@common/constants/api.constants';
import { Preview } from '@components/Preview';
import { EDIT_ALT_DISPLAY_LABELS } from '@common/constants/uiElements.constants';
import { ModalDuplicateImportedResource } from '@components/ModalDuplicateImportedResource';
import './ExternalResourcePreview.scss';
import { useInputsState } from '@src/store';

export const ExternalResourcePreview = () => {
  const { record } = useInputsState();
  const { fetchExternalRecordForPreview } = useRecordControls();
  const { externalId } = useParams();

  useEffect(() => {
    // TODO: UILD-443 - if applicable in future, pass in resource type from query params
    fetchExternalRecordForPreview(externalId, ExternalResourceIdType.Inventory);
  }, [externalId]);

  return (
    <div className="external-resource-preview">
      {record ? (
        <Preview
          altDisplayNames={EDIT_ALT_DISPLAY_LABELS}
          forceRenderAllTopLevelEntities
          entityRowDisplay
        />
      ) : (
        <ExternalResourceLoader />
      )}
      <ModalDuplicateImportedResource />
    </div>
  );
};
