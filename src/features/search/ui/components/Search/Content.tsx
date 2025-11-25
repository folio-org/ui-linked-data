import { FC, ReactNode } from 'react';
import { DOM_ELEMENTS } from '@/common/constants/domElementsIdentifiers.constants';

interface ContentProps {
  children: ReactNode;
}

export const Content: FC<ContentProps> = ({ children }) => {
  return <div className={DOM_ELEMENTS.classNames.itemSearchContent}>{children}</div>;
};
