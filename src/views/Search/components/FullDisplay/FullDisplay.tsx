import { FullDisplayType } from '@/common/constants/uiElements.constants';

import { Comparison } from '@/features/comparison';

import { useInputsState, useUIState } from '@/store';

import { PreviewContent } from './PreviewContent';

import './FullDisplay.scss';

export const FullDisplay = () => {
  const { activePreviewIds } = useInputsState(['activePreviewIds']);
  const { fullDisplayComponentType } = useUIState(['fullDisplayComponentType']);

  const contents = {
    [FullDisplayType.Basic]: !!activePreviewIds.length && <PreviewContent />,
    [FullDisplayType.Comparison]: <Comparison />,
  };

  return contents?.[fullDisplayComponentType];
};
