import { FC } from 'react';
import { ConditionalWrapper } from '@components/ConditionalWrapper';
import { Fields } from '@components/Preview/Fields';
import { checkShouldGroupWrap, getValueGroupWrapper } from './Fields';

type ChildFieldsProps = {
  schema: Schema;
  entryChildren?: string[];
  level: number;
  paths: Array<string>;
  altSchema?: Schema;
  altUserValues?: UserValues;
  altSelectedEntries?: Array<string>;
  altDisplayNames?: Record<string, string>;
  hideEntities?: boolean;
  forceRenderAllTopLevelEntities?: boolean;
  isGroupable?: boolean;
  isGroup?: boolean;
};

export const ChildFields: FC<ChildFieldsProps> = ({
  schema,
  entryChildren,
  paths,
  level,
  altSchema,
  altUserValues,
  altSelectedEntries,
  altDisplayNames,
  hideEntities,
  forceRenderAllTopLevelEntities,
  isGroupable,
  isGroup,
}) => {
  return (
    <>
      {entryChildren?.map(uuid => {
        const schemaEntry = schema.get(uuid);

        return (
          <ConditionalWrapper
            key={uuid}
            condition={(!isGroupable && checkShouldGroupWrap(level, schemaEntry)) || isGroup}
            wrapper={getValueGroupWrapper({ schemaEntry })}
          >
            <Fields
              key={uuid}
              uuid={uuid}
              base={schema}
              paths={paths}
              level={level + 1}
              altSchema={altSchema}
              altUserValues={altUserValues}
              altSelectedEntries={altSelectedEntries}
              altDisplayNames={altDisplayNames}
              hideEntities={hideEntities}
              forceRenderAllTopLevelEntities={forceRenderAllTopLevelEntities}
            />
          </ConditionalWrapper>
        );
      })}
    </>
  );
};
