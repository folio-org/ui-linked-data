import { useInputsState, useUIState } from '@src/store';
import { PreviewContent } from './PreviewContent';
import { FullDisplayType } from '@common/constants/uiElements.constants';
import { Comparison } from '@components/Comparison';
import './FullDisplay.scss';

export const FullDisplay = () => {
  const { previewContent } = useInputsState();
  const { fullDisplayComponentType } = useUIState();

  const contents = {
    [FullDisplayType.Basic]: !!previewContent.length && <PreviewContent />,
    [FullDisplayType.Comparison]: <Comparison />,
  };

  return contents?.[fullDisplayComponentType];
};
