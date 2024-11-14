import { FC, ReactNode, memo } from 'react';

type IConditionalWrapper = {
  condition?: boolean;
  wrapper?: ({ children }: { children: ReactNode }) => ReactNode;
  children?: string | ReactNode;
};

export const ConditionalWrapper: FC<IConditionalWrapper> = memo(({ condition, wrapper, children }) =>
  condition ? wrapper?.({ children }) : children,
);
