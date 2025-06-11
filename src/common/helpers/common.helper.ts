export const alphabeticSortLabel = <T extends { label?: string }>(a: T, b: T): 0 | -1 | 1 => {
  const aLabel = a.label?.toLocaleLowerCase();
  const bLabel = b.label?.toLocaleLowerCase();

  if (!aLabel || (!!bLabel && bLabel > aLabel)) return -1;
  if (!bLabel || aLabel > bLabel) return 1;

  return 0;
};

export const deleteFromSetImmutable = <T = unknown>(set: Set<T>, toDelete: T[]) => {
  const clone = new Set([...set]);

  toDelete.forEach(entry => clone.delete(entry));

  return clone;
};
