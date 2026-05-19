import { MarcContent } from '@/components/MarcContent';

import { useMarcPreviewState } from '@/store';

import './ModalViewMarc.scss';

export const ModalViewMarc = () => {
  const { basicValue: marcPreviewData } = useMarcPreviewState(['basicValue']);

  return (
    marcPreviewData && (
      <div className="view-marc-modal">
        <MarcContent marc={marcPreviewData} className="marc-contents" tabIndex={0} />
      </div>
    )
  );
};
