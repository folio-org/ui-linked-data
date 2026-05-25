import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { ExternalResourceIdType } from '@/common/constants/api.constants';
import { EDIT_ALT_DISPLAY_LABELS } from '@/common/constants/uiElements.constants';

import { Preview } from '@/features/preview';
import { useResourcePreviewQuery } from '@/features/resources';

import { useMarcPreviewState } from '@/store';

import { ExternalResourceLoader } from './components/ExternalResourceLoader';
import { ModalDuplicateImportedResource } from './components/ModalDuplicateImportedResource';

import './ExternalResourcePreview.scss';

export const ExternalResourcePreview = () => {
  const { resetBasicValue } = useMarcPreviewState(['resetBasicValue']);
  const { externalId } = useParams();
  const { data } = useResourcePreviewQuery(externalId, 'edit-link', {
    // TODO: UILD-443 - if applicable in future, pass in resource type from query params
    idType: ExternalResourceIdType.Inventory,
  });

  // TODO: UILD-552 - temporary solution. Reset the whole state on application unload.
  useEffect(() => {
    resetBasicValue();
  }, [externalId]);

  return (
    <div className="external-resource-preview">
      {data ? (
        <Preview
          altSchema={data.schema}
          altUserValues={data.userValues}
          altInitKey={data.initKey}
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
