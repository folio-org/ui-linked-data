import { MarcContent } from '@components/MarcContent';
import state from '@state';
import { useRecoilValue } from 'recoil';
import './ViewMarcModal.scss';

export const ViewMarcModal = () => {
  const marcPreviewData = useRecoilValue(state.data.marcPreview);

  return (
    marcPreviewData && (
      <div className="view-marc-modal">
        <MarcContent marc={marcPreviewData} className="marc-contents" />
      </div>
    )
  );
};
