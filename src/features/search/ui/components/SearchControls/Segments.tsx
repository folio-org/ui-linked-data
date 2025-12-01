import { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import { ButtonGroup } from '@/components/ButtonGroup';
import { Button, ButtonType } from '@/components/Button';
import { useSearchState } from '@/store';
import { SearchParam } from '../../../core';
import { useSearchContext } from '../../providers/SearchProvider';
import './Segments.scss';

export const Segments: FC = () => {
  const { config, activeUIConfig, onSegmentChange } = useSearchContext();
  const { navigationState } = useSearchState(['navigationState']);
  const currentSegment = (navigationState as Record<string, unknown>)?.[SearchParam.SEGMENT] as string | undefined;

  // Guard: Feature disabled
  if (!activeUIConfig.features?.hasSegments) {
    return null;
  }

  // Guard: No segments configured
  if (!config.segments) {
    return null;
  }

  const segments = Object.values(config.segments);

  // Guard: Empty segments
  if (segments.length === 0) {
    return null;
  }

  const handleSegmentClick = (segmentId: string) => {
    if (segmentId === currentSegment) return;

    onSegmentChange(segmentId);
  };

  return (
    <ButtonGroup className="search-segments" fullWidth>
      {segments.map(segment => {
        const isSelected = currentSegment === segment.id;

        return (
          <Button
            key={segment.id}
            type={isSelected ? ButtonType.Highlighted : ButtonType.Primary}
            aria-selected={isSelected}
            role="tab"
            className="search-segment-button"
            onClick={() => handleSegmentClick(segment.id)}
            data-testid={`id-search-segment-button-${segment.id}`}
          >
            <FormattedMessage id={`ld.${segment.id}`} />
          </Button>
        );
      })}
    </ButtonGroup>
  );
};
