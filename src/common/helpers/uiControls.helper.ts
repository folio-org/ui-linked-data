export const getUserValueByPath = (userValue: UserValue[], path: string) =>
  userValue.find(({ field }) => field === path)?.['value'];
