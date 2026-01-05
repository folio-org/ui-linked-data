import { FC, ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, ButtonType } from '@/components/Button';
import { useSearchContext } from '../../providers/SearchProvider';
import { isSegmentActive } from '../../utils/segmentUtils';

export interface SegmentProps {
  path: string;
  labelId?: string;
  defaultTo?: string;
  children?: ReactNode;
  testId?: string;
}

export const Segment: FC<SegmentProps> = ({ path, labelId, defaultTo, children, testId }) => {
  const { onSegmentChange, currentSegment } = useSearchContext();

  // Active if exact match OR prefix match (for parent segments)
  const isActive = isSegmentActive(currentSegment, path, true);
  const derivedLabelId = labelId ?? `ld.${path.split(':').pop()}`;

  const handleClick = () => {
    const targetPath = defaultTo ?? path;

    if (currentSegment === targetPath) return;

    onSegmentChange(targetPath);
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
    >
      {children ?? <FormattedMessage id={derivedLabelId} />}
    </Button>
  );
};
