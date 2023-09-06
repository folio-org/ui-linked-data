import { useRecoilValue } from 'recoil';
import classNames from 'classnames';
import state from '@state';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { RecordControls } from '../RecordControls';
import './Preview.scss';
import { FormattedMessage } from 'react-intl';

export const Preview = () => {
  const userValues = useRecoilValue(state.inputs.userValues);
  const schema = useRecoilValue(state.config.schema);
  const initialSchemaKey = useRecoilValue(state.config.initialSchemaKey);

  type Fields = {
    schema: Map<string, SchemaEntry>;
    uuid: string | null;
    level?: number;
    paths: Array<string>;
  };

  // TODO: potentially reuse <Fields /> from EditSection ?
  const Fields = ({ schema, uuid, paths, level = 0 }: Fields) => {
    if (!uuid || !paths?.includes(uuid)) return null;

    const { displayName, children, type } = schema.get(uuid) || {};

    return (
      <div className={classNames({ 'preview-block': level === 2 })} data-testid='preview-fields'>
        {type !== AdvancedFieldType.profile && type !== AdvancedFieldType.hidden && <strong>{displayName}</strong>}
        {children?.map((uuid: string) => (
          <Fields key={uuid} uuid={uuid} schema={schema} paths={paths} level={level + 1} />
        ))}
        {!children &&
          userValues[uuid]?.contents?.map(({ label, meta: { uri, parentUri } = {} }) => (
            <div key={`${label}${uri}`}>
              <div>{uri || parentUri ? <a href={uri || parentUri}>{label}</a> : label}</div>
            </div>
          ))}
      </div>
    );
  };

  return (
    <div className="preview-panel">
      <h3>
        <FormattedMessage id='marva.preview' />
      </h3>
      <Fields
        schema={schema}
        uuid={initialSchemaKey}
        paths={Object.keys(userValues)
          .map(key => schema.get(key)?.path)
          .flat()}
      />
      <br />
      <RecordControls />
    </div>
  );
};
