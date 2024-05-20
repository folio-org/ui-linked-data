import { FC, Fragment, ReactNode } from 'react';
import { IFields } from '@components/Fields';

interface IDuplicateSubcomponentContainer {
  entry: SchemaEntry;
  generateComponent: (f: Partial<IFields>) => ReactNode;
}

export const DuplicateSubcomponentContainer: FC<IDuplicateSubcomponentContainer> = ({ entry, generateComponent }) => {
  const { uuid, clonedBy } = entry;

  return (
    <Fragment key={uuid}>
      {generateComponent({ uuid, groupingDisabled: true })}

      {clonedBy?.map(uuid => generateComponent({ uuid, groupingDisabled: true }))}
    </Fragment>
  );
};
