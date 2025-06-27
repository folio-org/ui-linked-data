import { FC } from 'react';
import { checkShouldGroupWrap } from '@common/helpers/preview.helper';
import { ConditionalWrapper } from '@components/ConditionalWrapper';
import { getValueGroupWrapper } from './preview.wrappers';
import { ChildFieldsProps } from './preview.types';

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
  renderField,
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
            {renderField({
              uuid,
              base: schema,
              paths,
              level: level + 1,
              altSchema,
              altUserValues,
              altSelectedEntries,
              altDisplayNames,
              hideEntities,
              forceRenderAllTopLevelEntities,
            })}
          </ConditionalWrapper>
        );
      })}
    </>
  );
};
