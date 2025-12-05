export function isSegmentActive(currentSegment: string | undefined, candidate: string, matchPrefix = false): boolean {
  if (!currentSegment) return false;

  if (matchPrefix) {
    return currentSegment === candidate || currentSegment.startsWith(`${candidate}:`);
  }

  return currentSegment === candidate;
}

export function isParentSegmentActive(currentSegment: string | undefined, parentPath: string): boolean {
  if (!currentSegment) return false;

  return currentSegment === parentPath || currentSegment.startsWith(`${parentPath}:`);
}
