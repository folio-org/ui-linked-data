import { ExternalResourceLoader } from '@components/ExternalResourceLoader';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useRecordControls } from '@common/hooks/useRecordControls';
import { ExternalResourceIdType } from '@common/constants/api.constants';
import { Preview } from '@components/Preview';
import { EDIT_ALT_DISPLAY_LABELS } from '@common/constants/uiElements.constants';
import { ModalDuplicateImportedResource } from '@components/ModalDuplicateImportedResource';
import { useInputsState, useMarcPreviewState } from '@src/store';
import './ExternalResourcePreview.scss';

export const ExternalResourcePreview = () => {
  const { record } = useInputsState();
  const { fetchExternalRecordForPreview } = useRecordControls();
  const { resetBasicValue } = useMarcPreviewState();
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
