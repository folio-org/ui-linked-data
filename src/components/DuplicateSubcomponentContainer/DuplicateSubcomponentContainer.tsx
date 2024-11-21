import { FC, Fragment, ReactNode } from 'react';
import { IFields } from '@components/Fields';

interface IDuplicateSubcomponentContainer {
  entry: SchemaEntry;
  generateComponent: (f: Partial<IFields>) => ReactNode;
  twins?: string[];
}

export const DuplicateSubcomponentContainer: FC<IDuplicateSubcomponentContainer> = ({
  entry: { uuid },
  twins,
  generateComponent,
}) => (
  <Fragment key={uuid}>
    {generateComponent({ uuid, groupingDisabled: true })}

    {twins?.map(twinUuid => generateComponent({ uuid: twinUuid, groupingDisabled: true }))}
  </Fragment>
);
