import { MarcContent } from '@/components/MarcContent';

import { useMarcPreviewState } from '@/store';

import './ViewMarcModal.scss';

export const ViewMarcModal = () => {
  const { basicValue: marcPreviewData } = useMarcPreviewState(['basicValue']);

  return (
    marcPreviewData && (
      <div className="view-marc-modal">
        <MarcContent marc={marcPreviewData} className="marc-contents" />
      </div>
    )
  );
};
