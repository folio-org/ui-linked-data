import { useStoreSelector } from '@common/hooks/useStoreSelectors';
import { MarcContent } from '@components/MarcContent';
import './ViewMarcModal.scss';

export const ViewMarcModal = () => {
  const { value: marcPreviewData } = useStoreSelector().marcPreview;

  return (
    marcPreviewData && (
      <div className="view-marc-modal">
        <MarcContent marc={marcPreviewData} className="marc-contents" />
      </div>
    )
  );
};
