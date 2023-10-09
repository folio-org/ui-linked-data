import { useRecoilValue } from 'recoil';
import classNames from 'classnames';
import state from '@state';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import './Preview.scss';
import { FormattedMessage } from 'react-intl';
import { FC } from 'react';
import { GROUP_BY_LEVEL } from '@common/constants/bibframe.constants';

type Preview = {
  altSchema?: Map<string, SchemaEntry>;
  altUserValues?: UserValues;
  altInitKey?: string;
  headless?: boolean;
};

type Fields = {
  base: Map<string, SchemaEntry>;
  uuid: string | null;
  level?: number;
  paths: Array<string>;
};

const createIndent = (level: number) => level > GROUP_BY_LEVEL && ' · '.repeat(level - GROUP_BY_LEVEL);

export const Preview: FC<Preview> = ({ altSchema, altUserValues, altInitKey, headless = false }) => {
  const userValues = altUserValues || useRecoilValue(state.inputs.userValues);
  const schema = altSchema || useRecoilValue(state.config.schema);
  const initialSchemaKey = altInitKey || useRecoilValue(state.config.initialSchemaKey);

  // TODO: potentially reuse <Fields /> from EditSection ?
  const Fields = ({ base, uuid, paths, level = 0 }: Fields) => {
    if (!uuid || !paths?.includes(uuid)) return null;

    const { displayName, children, type } = base.get(uuid) || {};

    return (
      <div className={classNames({ 'preview-block': level === GROUP_BY_LEVEL })} data-testid="preview-fields">
        {type !== AdvancedFieldType.profile && type !== AdvancedFieldType.hidden && (
          <strong>
            <span>{createIndent(level)}</span>
            {displayName}
          </strong>
        )}
        {children?.map((uuid: string) => (
          <Fields key={uuid} uuid={uuid} base={base} paths={paths} level={level + 1} />
        ))}
        {(!children || !children.length) &&
          userValues[uuid]?.contents?.map(({ label, meta: { uri, parentUri } = {} }) => (
            <div key={`${label}${uri}`}>
              <div>
                <span>{createIndent(level + 1)}</span>
                {uri || parentUri ? <a href={uri || parentUri}>{label}</a> : label}
              </div>
            </div>
          ))}
      </div>
    );
  };

  return (
    <div className="preview-panel">
      {!headless && (
        <h3>
          <FormattedMessage id="marva.preview" />
        </h3>
      )}
      <Fields
        base={schema}
        uuid={initialSchemaKey}
        paths={Object.keys(userValues)
          .map(key => schema.get(key)?.path || '')
          .flat()}
      />
    </div>
  );
};
