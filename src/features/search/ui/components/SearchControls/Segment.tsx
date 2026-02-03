import { FC, ReactNode, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { logger } from '@/common/services/logger';
import { Button, ButtonType } from '@/components/Button';

import { useSearchContext } from '../../providers/SearchProvider';
import { isSegmentActive } from '../../utils/segmentUtils';

export interface SegmentProps {
  path: string;
  labelId?: string;
  defaultTo?: string;
  children?: ReactNode;
  testId?: string;
  onBeforeChange?: (segment: string) => Promise<void> | void;
  onAfterChange?: (segment: string) => Promise<void> | void;
}

export const Segment: FC<SegmentProps> = ({
  path,
  labelId,
  defaultTo,
  children,
  testId,
  onBeforeChange,
  onAfterChange,
}) => {
  const { onSegmentChange, currentSegment } = useSearchContext();
  const [isProcessing, setIsProcessing] = useState(false);

  // Active if exact match OR prefix match (for parent segments)
  const isActive = isSegmentActive(currentSegment, path, true);
  const derivedLabelId = labelId ?? `ld.${path.split(':').pop()}`;

  const handleClick = async () => {
    const targetPath = defaultTo ?? path;

    if (currentSegment === targetPath || isProcessing) return;

    try {
      setIsProcessing(true);

      if (onBeforeChange) {
        await onBeforeChange(targetPath);
      }

      onSegmentChange(targetPath);

      if (onAfterChange) {
        await onAfterChange(targetPath);
      }
    } catch (error) {
      logger.error('Segment change error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const derivedTestId = testId ?? `id-search-segment-button-${path}`;

  return (
    <Button
      type={isActive ? ButtonType.Highlighted : ButtonType.Primary}
      aria-selected={isSegmentActive(currentSegment, path)}
      role="tab"
      className="search-segment-button"
      onClick={handleClick}
      data-testid={derivedTestId}
      disabled={isProcessing}
    >
      {children ?? <FormattedMessage id={derivedLabelId} />}
    </Button>
  );
};
