import { useRecoilValue } from 'recoil';
import { DOM_ELEMENTS } from '@common/constants/domElementsIdentifiers.constants';
import state from '@state';
import './FullDisplay.scss';
import { PreviewContent } from './PreviewContent';

export const FullDisplay = () => {
  const previewContent = useRecoilValue(state.inputs.previewContent);

  return (
    !!previewContent.length && (
      <div className={DOM_ELEMENTS.classNames.fullDisplayContainer}>
        <PreviewContent />
      </div>
    )
  );
};
