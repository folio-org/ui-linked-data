import { FC } from 'react';
import { useRecoilValue } from 'recoil';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import state from '@state';
import { Fields } from './Fields';
import './Preview.scss';

type IPreview = {
  altSchema?: Schema;
  altUserValues?: UserValues;
  altInitKey?: string;
  altDisplayNames?: Record<string, string>;
  headless?: boolean;
  hideActions?: boolean;
  forceRenderAllTopLevelEntities?: boolean;
  entityRowDisplay?: boolean;
};

export const Preview: FC<IPreview> = ({
  altSchema,
  altUserValues,
  altInitKey,
  altDisplayNames,
  headless = false,
  hideActions,
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
      {!headless && (
        <h3>
          <FormattedMessage id="ld.preview" />
        </h3>
      )}
      {initialSchemaKey && (
        <Fields
          base={schema}
          uuid={initialSchemaKey}
          paths={Object.keys(userValues)
            .map(key => schema.get(key)?.path || '')
            .flat()}
          altUserValues={userValues}
          altDisplayNames={altDisplayNames}
          hideActions={hideActions}
          forceRenderAllTopLevelEntities={forceRenderAllTopLevelEntities}
        />
      )}
    </div>
  );
};
