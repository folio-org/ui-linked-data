import { FC, ReactNode } from 'react';
import { useSearchContext } from '../../providers/SearchProvider';
import { SearchBySelect } from './SearchBySelect';
import { QueryInput } from './QueryInput';

interface InputsWrapperProps {
  children?: ReactNode;
}

export const InputsWrapper: FC<InputsWrapperProps> = ({ children }) => {
  const { mode, activeUIConfig } = useSearchContext();

  // Custom mode: render provided children
  if (mode === 'custom' && children) {
    return <div className="inputs">{children}</div>;
  }

  // Auto mode: render based on config
  return (
    <div className="inputs">
      {activeUIConfig.features?.hasSearchBy && <SearchBySelect />}
      {activeUIConfig.features?.hasQueryInput && <QueryInput />}
    </div>
  );
};
