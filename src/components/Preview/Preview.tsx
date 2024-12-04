import { FC } from 'react';
import { useRecoilValue } from 'recoil';
import classNames from 'classnames';
import state from '@state';
import { Fields } from './Fields';
import './Preview.scss';

type IPreview = {
  altSchema?: Schema;
  altUserValues?: UserValues;
  altInitKey?: string;
  altDisplayNames?: Record<string, string>;
  hideActions?: boolean;
  hideEntities?: boolean;
  forceRenderAllTopLevelEntities?: boolean;
  entityRowDisplay?: boolean;
};

export const Preview: FC<IPreview> = ({
  altSchema,
  altUserValues,
  altInitKey,
  altDisplayNames,
  hideActions,
  hideEntities,
  forceRenderAllTopLevelEntities,
  entityRowDisplay,
}) => {
  const userValuesFromState = useRecoilValue(state.inputs.userValues);
  const schemaFromState = useRecoilValue(state.config.schema);
  const initialSchemaKeyFromState = useRecoilValue(state.config.initialSchemaKey);
  const userValues = altUserValues || userValuesFromState;
  const schema = altSchema || schemaFromState;
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
            .map(key => schema.get(key)?.path || '')
            .flat()}
          altSchema={altSchema}
          altUserValues={altUserValues}
          altDisplayNames={altDisplayNames}
          hideActions={hideActions}
          hideEntities={hideEntities}
          forceRenderAllTopLevelEntities={forceRenderAllTopLevelEntities}
        />
      )}
    </div>
  );
};
