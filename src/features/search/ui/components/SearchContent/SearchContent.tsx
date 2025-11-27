import { FC, ReactNode } from 'react';
import { DOM_ELEMENTS } from '@/common/constants/domElementsIdentifiers.constants';

interface SearchContentProps {
  children: ReactNode;
}

export const SearchContent: FC<SearchContentProps> = ({ children }) => {
  return <div className={DOM_ELEMENTS.classNames.itemSearchContent}>{children}</div>;
};
