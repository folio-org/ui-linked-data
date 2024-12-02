import { useMarcPreviewState } from '@src/store';
import { MarcContent } from '@components/MarcContent';
import './ViewMarcModal.scss';

export const ViewMarcModal = () => {
  const { basicValue: marcPreviewData } = useMarcPreviewState();

  return (
    marcPreviewData && (
      <div className="view-marc-modal">
        <MarcContent marc={marcPreviewData} className="marc-contents" />
      </div>
    )
  );
};
