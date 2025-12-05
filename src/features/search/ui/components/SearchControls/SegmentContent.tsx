import { FC, ReactNode } from 'react';
import { useSearchState } from '@/store';
import { SearchParam } from '../../../core';
import { isSegmentActive } from '../../utils/segmentUtils';

export interface SegmentContentProps {
  segment: string;
  matchPrefix?: boolean;
  children: ReactNode;
}

/**
 * Conditional rendering based on active segment.
 *
 * @example
 * // Exact match - shows only for "hubs" segment
 * <SegmentContent segment="hubs">
 *   <SourceToggle />
 * </SegmentContent>
 *
 * // Prefix match - shows for "authorities", "authorities:search", "authorities:browse"
 * <SegmentContent segment="authorities" matchPrefix>
 *   <AuthoritiesFilters />
 * </SegmentContent>
 */
export const SegmentContent: FC<SegmentContentProps> = ({ segment, matchPrefix = false, children }) => {
  const { navigationState } = useSearchState(['navigationState']);
  const currentSegment = (navigationState as Record<string, unknown>)?.[SearchParam.SEGMENT] as string | undefined;

  const isActive = isSegmentActive(currentSegment, segment, Boolean(matchPrefix));

  if (!isActive) return null;

  return <>{children}</>;
};
