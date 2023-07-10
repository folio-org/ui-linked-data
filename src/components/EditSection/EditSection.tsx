import { useEffect, FC, memo, useCallback, useMemo } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import classNames from 'classnames';
import state from '../../state/state';
import { LiteralField } from '../LiteralField/LiteralField';
import './EditSection.scss';
import { DropdownField } from '../DropdownField/DropdownField';
import { SimpleLookupField } from '../SimpleLookupField/SimpleLookupField';
import { PROFILE_IDS } from '../../common/constants/bibframe.constants';
import { ComplexLookupField } from '../ComplexLookupField/ComplexLookupField';
import { applyUserValues } from '../../common/helpers/profile.helper';
import { AUTOSAVE_INTERVAL } from '../../common/constants/storage.constants';
import { generateRecordBackupKey } from '../../common/helpers/progressBackup.helper';
import { localStorageService } from '../../common/services/storage';
import { AdvancedFieldType } from '../../common/constants/uiControls.constants';

type Fields = {
  schema: Map<string, SchemaEntry>;
  uuid: string;
  level?: number;
};

export const EditSection = memo(() => {
  const resourceTemplates = useRecoilValue(state.config.selectedProfile)?.json.Profile.resourceTemplates;
  const schema = useRecoilValue(state.config.schema);
  const initialSchemaKey = useRecoilValue(state.config.initialSchemaKey);
  const [selectedEntries, setSelectedEntries] = useRecoilState(state.config.selectedEntries);
  const [userValues, setUserValues] = useRecoilState(state.inputs.userValues);
  const [isEdited, setIsEdited] = useRecoilState(state.status.recordIsEdited);
  const record = useRecoilValue(state.inputs.record);

  useEffect(() => {
    if (!isEdited) return;

    const saveRecordLocally = setInterval(() => {
      try {
        const parsed = applyUserValues(schema, userValues, initialSchemaKey);

        if (!parsed) return;

        const profile = record?.profile ?? PROFILE_IDS.MONOGRAPH;
        const key = generateRecordBackupKey(profile, record?.id);

        localStorageService.serialize(key, parsed);
      } catch (error) {
        console.error('Unable to automatically save changes:', error);
      }
    }, AUTOSAVE_INTERVAL);

    return () => clearInterval(saveRecordLocally);
  }, [isEdited, userValues]);

  const onChange = (uuid: string, contents: Array<UserValueContents>) => {
    if (!isEdited) {
      setIsEdited(true);
    }

    setUserValues(oldValue => ({
      ...oldValue,
      [uuid]: {
        uuid,
        contents,
      },
    }));
  };

  const drawComponent = useCallback(
    (schema: Map<string, SchemaEntry>, { uuid, displayName = '', type, children, constraints }: SchemaEntry) => {
      if (type === AdvancedFieldType.literal) {
        return (
          <LiteralField
            displayName={displayName}
            uuid={uuid}
            value={userValues[uuid]?.contents[0].label}
            onChange={onChange}
          />
        );
      }

      if (type === AdvancedFieldType.dropdown && children) {
        const options = children
          .map(id => schema.get(id))
          .map(entry => ({
            label: entry?.displayName ?? '',
            value: entry?.uri ?? '', // TBD
            uri: entry?.uri ?? '',
            id: entry?.uuid,
          }));

        const selectedOption = options?.find(({ id }) => id && selectedEntries.includes(id));

        const handleChange = (option: any) => {
          setSelectedEntries([...selectedEntries.filter(id => id !== selectedOption?.id), option.id]);
        };

        return (
          <DropdownField
            options={options}
            name={displayName}
            uuid={uuid}
            onChange={handleChange}
            value={selectedOption}
          />
        );
      }

      if (type === AdvancedFieldType.simple) {
        return (
          <SimpleLookupField
            uri={constraints?.useValuesFrom[0] || ''}
            displayName={displayName}
            uuid={uuid}
            onChange={onChange}
            parentUri={constraints?.valueDataType?.dataTypeURI}
            value={userValues[uuid]?.contents}
          />
        );
      }

      if (type === AdvancedFieldType.complex) {
        return (
          <ComplexLookupField
            label={displayName}
            uuid={uuid}
            onChange={onChange}
            value={userValues[uuid]?.contents?.[0]}
          />
        );
      }

      return null;
    },
    [selectedEntries, setSelectedEntries],
  );

  const Fields: FC<Fields> = useCallback(
    ({ schema, uuid, level = 0 }) => {
      const entry = schema.get(uuid);

      if (!entry) return null;

      const { displayName, type, children } = entry;

      const isDropdownAndSelected = type === AdvancedFieldType.dropdownOption && selectedEntries.includes(uuid);
      const shouldRenderChildren = isDropdownAndSelected || type !== AdvancedFieldType.dropdownOption;
      return (
        <div className={classNames({ 'edit-section-group': level === 2 })}>
          {type === AdvancedFieldType.block && <strong>{displayName}</strong>}
          {(type === AdvancedFieldType.group || type === AdvancedFieldType.groupComplex) && <span>{displayName}</span>}
          {drawComponent(schema, entry)}
          {shouldRenderChildren &&
            children?.map(uuid => <Fields schema={schema} uuid={uuid} key={uuid} level={level + 1} />)}
        </div>
      );
    },
    [drawComponent, selectedEntries],
  );

  const memoisedFields = useMemo(
    () => schema && initialSchemaKey && <Fields schema={schema} uuid={initialSchemaKey} />,
    [Fields, initialSchemaKey, schema],
  );

  return resourceTemplates ? <div className="edit-section">{memoisedFields}</div> : null;
});
