import { FC, useMemo, useState, type ReactElement } from 'react';
import { SearchContext } from '@src/contexts';

type SearchProviderProps = {
  value: SearchParams & { defaultNavigationSegment?: string };
  children: ReactElement<any>;
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
