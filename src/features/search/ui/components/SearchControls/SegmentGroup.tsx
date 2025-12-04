import { FC, ReactNode } from 'react';
import { ButtonGroup } from '@/components/ButtonGroup';
import { useSearchState } from '@/store';
import { SearchParam } from '../../../core';
import './Segments.scss';

export interface SegmentGroupProps {
  parentPath?: string;
  className?: string;
  children: ReactNode;
}

/**
 * Container for segment buttons with optional parent-path filtering.
 *
 * @example
 * // Top-level segments (always visible)
 * <SegmentGroup>
 *   <Segment path="resources" />
 *   <Segment path="authorities" defaultTo="authorities:search" />
 * </SegmentGroup>
 *
 * // Nested segments (only when authorities is active)
 * <SegmentGroup parentPath="authorities">
 *   <Segment path="authorities:search" />
 *   <Segment path="authorities:browse" />
 * </SegmentGroup>
 */
export const SegmentGroup: FC<SegmentGroupProps> = ({ parentPath, className, children }) => {
  const { navigationState } = useSearchState(['navigationState']);
  const currentSegment = (navigationState as Record<string, unknown>)?.[SearchParam.SEGMENT] as string | undefined;

  // Only render if parent path matches (or no parent specified)
  if (parentPath) {
    // Check if current segment starts with parentPath or equals parentPath
    const isParentActive = currentSegment === parentPath || currentSegment?.startsWith(`${parentPath}:`);

    if (!isParentActive) {
      return null;
    }
  }

  const groupClassName = className ? `search-segments ${className}` : 'search-segments';

  return (
    <ButtonGroup className={groupClassName} fullWidth>
      {children}
    </ButtonGroup>
  );
};
