import { getRdfRecordLink } from '@common/api/records.api';

export const useResourceExport = () => {
  const exportInstanceRdf = (recordId: string) => {
    const exportLink = getRdfRecordLink(recordId);
    console.log(exportLink);
    const a = document.createElement('a');
    a.href = exportLink;
    a.download = `${recordId}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return { exportInstanceRdf };
};
