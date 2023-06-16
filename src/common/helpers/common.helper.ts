export const replaceItemAtIndex = <T, K>(arr: T[], index: number, newValue: K) => {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
};

export const aplhabeticSortLabel = <T extends { label: string }>(a: T, b: T): 0 | -1 | 1 => {
  if (a.label < b.label) return -1;
  if (a.label > b.label) return 1;

  return 0;
};
