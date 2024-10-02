import { FC, useState } from 'react';
import { SearchContext } from '@src/contexts';

type SearchProviderProps = {
  value: SearchParams & { defaultNavigationSegment?: string; hasMultilineSearchInput?: boolean };
  children: ReactElement;
};

export const SearchProvider: FC<SearchProviderProps> = ({ value, children }) => {
  const [navigationSegment, setNavigationSegment] = useState(value.defaultNavigationSegment);

  return (
    <SearchContext.Provider
      value={{ ...value, navigationSegment: { value: navigationSegment, set: setNavigationSegment } }}
    >
      {children}
    </SearchContext.Provider>
  );
};
