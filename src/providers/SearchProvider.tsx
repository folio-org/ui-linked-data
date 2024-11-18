import { FC, useMemo, useState } from 'react';
import { SearchContext } from '@src/contexts';

type SearchProviderProps = {
  value: SearchParams & { defaultNavigationSegment?: string; hasMultilineSearchInput?: boolean };
  children: ReactElement;
};

export const SearchProvider: FC<SearchProviderProps> = ({ value, children }) => {
  const [navigationSegment, setNavigationSegment] = useState(value.defaultNavigationSegment);

  const contextValue = useMemo(
    () => ({
      ...value,
      navigationSegment: { value: navigationSegment, set: setNavigationSegment },
    }),
    [navigationSegment, value],
  );

  return <SearchContext.Provider value={contextValue}>{children}</SearchContext.Provider>;
};
