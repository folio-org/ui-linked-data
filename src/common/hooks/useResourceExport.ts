import { getRdfRecord } from '@common/api/records.api';
import { initiateUserAgentDownload } from '@common/helpers/download.helper';

export const useResourceExport = () => {
  const exportInstanceRdf = async (resourceId: string) => {
    const response = await getRdfRecord(resourceId);
    if (response?.ok) {
      const rdf = await response.blob();
      initiateUserAgentDownload(rdf, `${resourceId}.json`);
    }
  };

  return { exportInstanceRdf };
};
