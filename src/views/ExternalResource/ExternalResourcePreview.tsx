import { ExternalResourceLoader } from '@components/ExternalResourceLoader';
import state from '@state';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { useEffect } from 'react';
import { useRecordControls } from '@common/hooks/useRecordControls';
import { ExternalResourceIdType } from '@common/constants/api.constants';
import { Preview } from '@components/Preview';
import { EDIT_ALT_DISPLAY_LABELS } from '@common/constants/uiElements.constants';
import './ExternalResourcePreview.scss';

export const ExternalResourcePreview = () => {
  const record = useRecoilValue(state.inputs.record);
  const { fetchExternalRecordForPreview } = useRecordControls();
  const { externalId } = useParams();

  useEffect(() => {
    // TODO: if applicable in future, pass in resource type from query params
    fetchExternalRecordForPreview(externalId, ExternalResourceIdType.Inventory);
  }, [externalId]);

  return (
    <div className="external-resource-preview">
      {record ? (
        <Preview
          altDisplayNames={EDIT_ALT_DISPLAY_LABELS}
          hideActions
          headless
          forceRenderAllTopLevelEntities
          entityRowDisplay
        />
      ) : (
        <ExternalResourceLoader />
      )}
    </div>
  );
};
