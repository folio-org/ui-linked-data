import { FC } from 'react';
import classNames from 'classnames';
import { useInputsState, useProfileState } from '@src/store';
import { Fields } from './Fields';
import './Preview.scss';

type IPreview = {
  altSchema?: Schema;
  altUserValues?: UserValues;
  altSelectedEntries?: Array<string>;
  altInitKey?: string;
  altDisplayNames?: Record<string, string>;
  hideEntities?: boolean;
  forceRenderAllTopLevelEntities?: boolean;
  entityRowDisplay?: boolean;
};

export const Preview: FC<IPreview> = ({
  altSchema,
  altUserValues,
  altSelectedEntries,
  altInitKey,
  altDisplayNames,
  hideEntities,
  forceRenderAllTopLevelEntities,
  entityRowDisplay,
}) => {
  const { userValues: userValuesFromState } = useInputsState();
  const { schema: schemaFromState, initialSchemaKey: initialSchemaKeyFromState } = useProfileState();
  const userValues = altUserValues ?? userValuesFromState;
  const schema = altSchema ?? schemaFromState;
  const initialSchemaKey = altInitKey ?? initialSchemaKeyFromState;

  return (
    <div
      className={classNames('preview-panel', { 'preview-panel-row': entityRowDisplay })}
      data-testid="preview-fields"
    >
      {initialSchemaKey && (
        <Fields
          base={schema}
          uuid={initialSchemaKey}
          paths={Object.keys(userValues)
            .map(key => schema.get(key)?.path ?? '')
            .flat()}
          altSchema={altSchema}
          altUserValues={altUserValues}
          altSelectedEntries={altSelectedEntries}
          altDisplayNames={altDisplayNames}
          hideEntities={hideEntities}
          forceRenderAllTopLevelEntities={forceRenderAllTopLevelEntities}
        />
      )}
    </div>
  );
};
