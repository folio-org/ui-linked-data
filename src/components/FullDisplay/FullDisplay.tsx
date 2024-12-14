import { DOM_ELEMENTS } from '@common/constants/domElementsIdentifiers.constants';
import { useInputsState } from '@src/store';
import './FullDisplay.scss';
import { PreviewContent } from './PreviewContent';

export const FullDisplay = () => {
  const { previewContent } = useInputsState();

  return (
    !!previewContent.length && (
      <div className={DOM_ELEMENTS.classNames.fullDisplayContainer}>
        <PreviewContent />
      </div>
    )
  );
};
