import { FullDisplayType } from '@/common/constants/uiElements.constants';
import { Comparison } from '@/components/Comparison';

import { useInputsState, useUIState } from '@/store';

import { PreviewContent } from './PreviewContent';

import './FullDisplay.scss';

export const FullDisplay = () => {
  const { previewContent } = useInputsState(['previewContent']);
  const { fullDisplayComponentType } = useUIState(['fullDisplayComponentType']);

  const contents = {
    [FullDisplayType.Basic]: !!previewContent.length && <PreviewContent />,
    [FullDisplayType.Comparison]: <Comparison />,
  };

  return contents?.[fullDisplayComponentType];
};
