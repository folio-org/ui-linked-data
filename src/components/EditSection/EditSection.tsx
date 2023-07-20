import { useEffect, memo, useCallback, useState } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import state from '@state';
import { LiteralField } from '../LiteralField';
import { DropdownField } from '../DropdownField';
import { SimpleLookupField } from '../SimpleLookupField';
import { ComplexLookupField } from '../ComplexLookupField';
import { applyUserValues } from '@helpers/profile.helper';
import { saveRecordLocally } from '@helpers/record.helper';
import { PROFILE_IDS } from '@constants/bibframe.constants';
import { AUTOSAVE_INTERVAL } from '@constants/storage.constants';
import { AdvancedFieldType } from '@constants/uiControls.constants';
import { Fields } from '../Fields';
import './EditSection.scss';

const WINDOW_SCROLL_OFFSET_TRIG = 100;

export const EditSection = memo(() => {
  const resourceTemplates = useRecoilValue(state.config.selectedProfile)?.json.Profile.resourceTemplates;
  const schema = useRecoilValue(state.config.schema);
  const initialSchemaKey = useRecoilValue(state.config.initialSchemaKey);
  const [selectedEntries, setSelectedEntries] = useRecoilState(state.config.selectedEntries);
  const [userValues, setUserValues] = useRecoilState(state.inputs.userValues);
  const [isEdited, setIsEdited] = useRecoilState(state.status.recordIsEdited);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const record = useRecoilValue(state.inputs.record);

  const onWindowScroll = () => setShowScrollToTop(window.scrollY > WINDOW_SCROLL_OFFSET_TRIG);

  useEffect(() => {
    if (!isEdited) return;

    const autoSaveRecord = setInterval(() => {
      try {
        const parsed = applyUserValues(schema, userValues, initialSchemaKey);

        if (!parsed) return;

        const profile = record?.profile ?? PROFILE_IDS.MONOGRAPH;

        saveRecordLocally(profile, parsed, record?.id);
      } catch (error) {
        console.error('Unable to automatically save changes:', error);
      }
    }, AUTOSAVE_INTERVAL);

    return () => clearInterval(autoSaveRecord);
  }, [isEdited, userValues]);

  useEffect(() => {
    window.addEventListener('scroll', onWindowScroll);

    return () => window.removeEventListener('scroll', onWindowScroll);
  });

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
    ({
      schema,
      entry: { uuid, displayName = '', type, children, constraints },
    }: {
      schema: Map<string, SchemaEntry>;
      entry: SchemaEntry;
    }) => {
      if (type === AdvancedFieldType.block) {
        return <strong id={uuid}>{displayName}</strong>;
      }

      if (type === AdvancedFieldType.group || type === AdvancedFieldType.groupComplex) {
        return <span id={uuid}>{displayName}</span>;
      }

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
    [selectedEntries],
  );

  return resourceTemplates ? (
    <div className="edit-section">
      <h3>Edit</h3>
      <Fields
        drawComponent={drawComponent}
        schema={schema}
        uuid={initialSchemaKey}
        groupClassName="edit-section-group"
      />
      {showScrollToTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="back-to-top">
          Back to top
        </button>
      )}
    </div>
  ) : null;
});
